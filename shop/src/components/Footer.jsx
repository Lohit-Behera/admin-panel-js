import { ChevronsRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

function Footer() {
  const data = [
    {
      title: "Information",
      links: [
        {
          name: "About Us",
          link: "#",
        },
        {
          name: "FAQ",
          link: "#",
        },
        {
          name: "Order history",
          link: "#",
        },
        {
          name: "Order information",
          link: "#",
        },
      ],
    },
    {
      title: "Customer Service",
      links: [
        {
          name: "Contact Us",
          link: "#",
        },
        {
          name: "Returns",
          link: "#",
        },
        {
          name: "Site Map",
          link: "#",
        },
        {
          name: "My Account",
          link: "#",
        },
      ],
    },
    {
      title: "My Account",
      links: [
        {
          name: "Brands",
          link: "#",
        },
        {
          name: "Gift Vouchers",
          link: "#",
        },
        {
          name: "Affiliates",
          link: "#",
        },
        {
          name: "Specials",
          link: "#",
        },
        {
          name: "Our Blog",
          link: "#",
        },
      ],
    },
    {
      title: "Contact Us",
      links: [
        {
          name: `My Company,75000 Paris France`,
          icon: <MapPin className="w-6 h-6 mr-2" />,
        },
        {
          name: "Email: sales@yourcompany.com",
          icon: <Mail className="w-6 h-6 mr-2" />,
        },
        {
          name: "Phone 1: 0123456789",
          icon: <Phone className="w-6 h-6 mr-2" />,
        },
      ],
    },
  ];
  return (
    <footer className="w-full flex flex-col space-y-4 p-4 bg-zinc-200 dark:bg-zinc-900">
      <div className="flex flex-wrap md:flex justify-between gap-4 ">
        {data.map((item) => (
          <div key={item.title}>
            <h3 className="text-base md:text-lg font-bold">{item.title}</h3>
            <ul className="space-y-1">
              {item.links.map((link) => (
                <li key={link.name}>
                  <div className="relative group flex text-xs sm:text-sm hover:text-primary transition-colors duration-200 group">
                    {!link.icon && (
                      <div className="w-0 translate-y-[0%] opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-y-100 group-hover:opacity-100">
                        <ChevronsRight className="w-4 h-4 hidden group-hover:inline my-auto text-primary" />
                      </div>
                    )}
                    {link.link ? (
                      <Link href={link.link || "#"}>{link.name}</Link>
                    ) : (
                      <span className="flex space-x-2 justify-center items-center my-auto cursor-default">
                        {link.icon && link.icon}
                        {link.name}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
