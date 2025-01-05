'use server';

import pb from '@/lib/pocketbase';

interface StravaData {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token?: string;
    code?: string;
    athlete_id: string;
}

export interface StravaStats {
    all_run_totals: {
        count: number;
        distance: number;
    };
    recent_run_totals: {
        count: number;
        distance: number;
    };
}

export async function refreshAccessToken({ data }: { data: StravaData }) {
    const resToken = await fetch(
        `https://www.strava.com/oauth/token?client_id=${data.client_id}&client_secret=${data.client_secret}&refresh_token=${data.refresh_token}&grant_type=refresh_token`,
        {
            method: "POST",
        }
    );
    const { access_token: newToken, refresh_token: newRefreshToken } =
        await resToken.json();
    const dataUpdated = {
        "refresh_token": newRefreshToken,
        "access_token": newToken
    };
    pb.collection("strava_info").update("wkiprs54th2y531", dataUpdated);
    return { newToken, newRefreshToken };
}

async function createStravaData(data: StravaStats) {
    const createData = {
        "recent_run_totals": data.recent_run_totals,
        "all_run_totals": data.all_run_totals
    }
    await pb.collection("strava_data").create(createData);
}

async function removeOldStatistcs() {
    const allStats = await pb.collection("strava_data").getList(1, 10);
    const today = new Date();
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    const sevenDaysAgoStart = new Date(sevenDaysAgo.setHours(0, 0, 0, 0));

    for (const stat of allStats.items) {
        const date = new Date(stat.created);
        if (date < sevenDaysAgoStart || date > todayEnd) {
            pb.collection("strava_data").delete(stat.id);
        }
    }
}

export async function fetchStats() {
    let stats: StravaStats;

    await pb.collection("_superusers").authWithPassword(String(process.env.POCKETBASE_ADMIN_MAIL), String(process.env.POCKETBASE_ADMIN_PASSWORD));
    const stravaData: { items: StravaStats[] } = await pb.collection("strava_data").getList(1, 1, {
        filter: "created > @todayStart"
    });

    // if stravaData.items is empty, fetch new data
    if (!stravaData.items.length) {
        console.log("fetching new data");
        const data: StravaData = await pb.collection("strava_info").getOne("wkiprs54th2y531");
        const { newToken } = await refreshAccessToken({ data });
        const resStats = await fetch(
            `https://www.strava.com/api/v3/athletes/${data.athlete_id}/stats?access_token=${newToken}`
        );
        stats = await resStats.json();
        createStravaData(stats);
        removeOldStatistcs();
        pb.authStore.clear();
    } else {
        console.log("using cached data");
        stats = stravaData.items[0];
    }

    return stats;
}