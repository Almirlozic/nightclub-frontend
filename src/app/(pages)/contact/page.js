"use client";
import H2Normal from "@/components/H2Normal";
import ContactUs from "@/components/ContactUs";



const hej = () => {
    return (
        <div className="bg-(--color-bg) text-white mb-12">
             <H2Normal title="Contact Us" bgImage="/assets/bg/footerbg.jpg" />
            <ContactUs />

            
        </div>
    );
}

export default hej;