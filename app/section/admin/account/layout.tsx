export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start h-screen w-screen container pt-24">
            {children}
        </div>
    );
}