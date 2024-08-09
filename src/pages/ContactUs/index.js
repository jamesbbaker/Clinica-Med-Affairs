import ContactSupport from "../../components/ContactSupport";

export default function ContactUs({closeContact}) {
  return (
    <div className="h-full max-h-[80vh] md:max-h-[100%] md:overflow-hidden overflow-y-auto w-full">
  
      <ContactSupport closeContact={closeContact} contactPage />
    
    </div>
  );
}
