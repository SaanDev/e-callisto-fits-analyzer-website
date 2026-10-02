export default function PageIntro({ label, title, children }: {
    label: string;
    title: string;
    children: React.ReactNode;
}) { return <div className="page-hero wrap"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{children}</p></div>; }
