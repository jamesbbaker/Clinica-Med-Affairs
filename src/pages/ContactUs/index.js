import ContactSupport from "../../components/ContactSupport";
import Navbar from "../../components/Navbar";

export default function ContactUs() {
  return (
    <div className="h-full w-full bg-slate-200">
      <Navbar />
      <div className="flex h-[100vh] justify-center items-center max-w-[70%] m-auto">
      <ContactSupport contactPage />
      </div>
    </div>
  );
}
