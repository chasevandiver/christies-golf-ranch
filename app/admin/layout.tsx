import "../globals.css";
import "./admin.css";

export const metadata = {
  title: "Admin — Christie's Golf Ranch",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-body">{children}</div>;
}
