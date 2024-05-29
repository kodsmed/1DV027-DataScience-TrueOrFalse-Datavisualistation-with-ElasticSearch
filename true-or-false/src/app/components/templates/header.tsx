import type { Link } from "@/app/config/links";

/**
 * The Header component
 *
 * @param {String} title - The title of the page
 * @param {String} description - The description, or subtitle if you will, of the page
 * @param {Link[]} links - The links to render in the header
 * @returns {JSX.Element}
 */
export function Header({ title, description, links }: { title: String, description: String, links: Link[]}) {
  return (
    <div className = "bg-black p-4 h-[100px] flex flex-row space-x-4 items-center">
      <div className = "flex flex-col justify-center items-center">
        <h1 className = "text-slate-100 text-4xl text-center border-b-2 border-slate-400">{title}</h1>
        <p className = "text-slate-100 text-xl italic text-center">{description}</p>
      </div>
      <div className = "flex flex-row space-x-4 grow justify-center">
        {links.map((link) => (
          <a key={link.name} href={process.env.BASE_URL + link.href} className = "text-slate-100 hover:text-black hover:bg-slate-100 px-4 py-4 rounded">{link.name}</a>
        ))}
      </div>
    </div>
  );
}