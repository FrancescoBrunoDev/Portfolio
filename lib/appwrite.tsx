import { Client, Account, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_PROJECT ?? '')
    .setKey(process.env.APPWRITE_KEY ?? '');

const databases = new Databases(client);

export async function createSessionClient() {
    const session = cookies().get("my-custom-session");
    if (!session || !session.value) {
        throw new Error("No session");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
    };
}

export async function createAdminClient() {
    return {
        get account() {
            return new Account(client);
        },
    };
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        return null;
    }
}

export async function getCollection(collectionId: string) {
    return await databases.getCollection(
        process.env.APPWRITE_DATABASE_ID ?? '',
        collectionId,
    );
}

export async function getAllDocuments(collectionId: string) {
    const documents = await databases.listDocuments(
        process.env.APPWRITE_WORK_DATABASE_ID ?? '',
        collectionId,
        []
    )
    return documents;
}