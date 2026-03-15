import CustomLink2 from "../Components/Shared/CustomLink2";

type Link = {
  to: string;
  label: string;
};

export default function TableLayout({
  title,
  subtitle,
  links,
  children,
}: {
  title: string;
  subtitle: string;
  links?: Link[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          <div className="flex gap-2">
            {links?.map((link) => (
              <CustomLink2 key={link.to} to={link.to} label={link.label} />
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
