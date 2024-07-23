import ContactSupport from "../../components/ContactSupport";
import Navbar from "../../components/Navbar";

export default function ContactUs() {
  return (
    <div className="h-full w-full bg-white">
      <Navbar />
      <div className="flex h-[100vh] justify-center items-center max-w-[75%] m-auto">
      <ContactSupport contactPage />
      </div>
    </div>
  );
}
