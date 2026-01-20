import Image from 'next/image';

export default function Footer({ variant = "default" }) {
  const getNewsletterText = () => {
    switch (variant) {
      case "about":
        return "Subscribe to our newsletter for the latest updates, terrible puns, and occasional insights about web development.";
      case "services":
        return "Subscribe to our newsletter for web development tips, industry insights, and the occasional tech joke.";
      case "contact":
        return "Subscribe to our newsletter for web development tips, project showcases, and the occasional behind-the-scenes story.";
      default:
        return "Subscribe to our newsletter for the latest updates on features and releases.";
    }
  };

  // const getCopyrightText = () => {
  //   switch (variant) {
  //     case "about":
  //       return "© 2025 Visionary Advance. All rights reserved. No coffee was harmed in the making of this website.";
  //     case "services":
  //       return "© 2025 Visionary Advance. All rights reserved. Building the web, one pixel at a time.";
  //     case "contact":
  //       return "© 2025 Visionary Advance. All rights reserved. Let's build something amazing together.";
  //     default:
  //       return "© 2025 Visionary Advance. All rights reserved.";
  //   }
  // };

  // const getConnectTitle = () => {
  //   switch (variant) {
  //     case "about":
  //       return "Follow Our Chaos";
  //     case "services":
  //     case "contact":
  //       return "Connect With Us";
  //     default:
  //       return "Follow Us";
  //   }
  // };

  // const getButtonText = () => {
  //   switch (variant) {
  //     case "about":
  //       return "Join the Fun";
  //     default:
  //       return "Join";
  //   }
  // };

  // const getServicesLinks = () => {
  //   if (variant === "services") {
  //     return [
  //       "Web Design",
  //       "Web Development", 
  //       "Web Maintenance",
  //       "Web Hosting",
  //       "SEO Optimization",
  //     ];
  //   }
  //   return [
  //     "About Us",
  //     "Our Services", 
  //     variant === "contact" ? "Portfolio" : "Contact Us",
  //     variant === "contact" ? "Blog" : "Blog Posts",
  //     "Support Center",
  //   ];
  // };

  const services = [
    {name: "About Us", link: "/about"},
    {name: "Our Services", link: "/services"},
    {name: "Contact Us", link: "/contact"},
    {name: "Home", link: "/"},
  ]

  const getSocialPlatforms = () => {
    if (variant === "services" || variant === "contact") {
      return ["Facebook", "Instagram", "X", "LinkedIn", "GitHub"];
    }
    if (variant === "about") {
      return ["Facebook", "Instagram", "X", "LinkedIn", "TikTok"];
    }
    return ["Facebook", "Instagram", "X", "LinkedIn", "YouTube"];
  };


  const links = [
    {name:"Privacy Policy", link:"/privacy-policy"}
  ]

  const date = new Date().getFullYear();

  return (
    <footer className="px-4 md:px-16 py-16 md:py-20 bg-[#000606]">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12 lg:grid lg:grid-cols-4 lg:gap-16 lg:space-y-0 mb-16 md:mb-20">
          {/* Newsletter */}
          <div className="lg:col-span-2 space-y-6">
           <Image className="w-20" src="/Img/VALogo.png" alt="Visionary Advance Logo" width={80} height={80} quality={100} />

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-manrope font-semibold text-white">
              {variant === "services" ? "Our Services" : "Quick Links"}
            </h3>
            <div className="space-y-2">
              {services.map((service) => (
                <a
                  key={service.link}
                  href={service.link}
                  className="block font-manrope text-sm text-white hover:text-gray-300 transition-colors py-2"
                >
                  {service.name}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-manrope font-semibold text-white">
              {/* {getConnectTitle()} */}
            </h3>
            {/* <div className="space-y-2">
              {getSocialPlatforms().map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="block font-manrope text-sm text-white hover:text-gray-300 transition-colors py-2"
                >
                  {platform}
                </a>
              ))}
            </div> */}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t-2 border-white pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="font-manrope text-sm text-white">
             © <span>{date} </span> Visionary Advance. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {links.map(
                (links) => (
                  <a
                    key={links.link}
                    href={links.link}
                    className="font-manrope text-sm text-white underline hover:text-gray-300 transition-colors"
                  >
                    {links.name}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}