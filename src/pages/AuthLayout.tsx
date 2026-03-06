import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  const defaultLists = [
    [
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/383/persistent-resource/santiago-resume-templates.jpg?v=1656070649",
        alt: "Santiago resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/488/persistent-resource/dublin-resume-templates.jpg?v=1651663693",
        alt: "Dublin resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/370/persistent-resource/stockholm-resume-templates.jpg?v=1656506913",
        alt: "Stockholm resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/441/persistent-resource/sydney-resume-templates.jpg?v=1651657428",
        alt: "Sydney resume template",
      },
    ],
    [
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/406/persistent-resource/vienna-resume-templates.jpg?v=1656070334",
        alt: "Vienna resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/389/persistent-resource/new-york-resume-templates.jpg?v=1651656959",
        alt: "New York resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/370/persistent-resource/stockholm-resume-templates.jpg?v=1656506913",
        alt: "Stockholm resume template",
      },
      {
        src: "https://s3.resume.io/cdn-cgi/image/width=384,format=auto/uploads/local_template_image/image/441/persistent-resource/sydney-resume-templates.jpg?v=1651657428",
        alt: "Sydney resume template",
      },
    ],
  ];

  return (
    <div
      className="flex h-screen w-full"
      style={{
        backgroundImage: "url('/anh_nen.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/7 z-0"></div>

      <div className="z-20 hidden md:flex mt-5 h-[875px] w-full justify-center items-center overflow-hidden">
        <div className="relative flex gap-10 w-full justify-center">
          <div className="relative flex flex-col gap-8 animate-scroll-infinite h-[200%]">
            {[...defaultLists[0], ...defaultLists[0]].map((item, i) => (
              <div
                key={`col1-${i}`}
                className="w-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          <div className="relative flex flex-col gap-8 animate-scroll-infinite-reverse h-[200%]">
            {[...defaultLists[1], ...defaultLists[1]].map((item, i) => (
              <div
                key={`col2-${i}`}
                className="w-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
