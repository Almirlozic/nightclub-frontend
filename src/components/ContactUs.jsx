"use client";
import { useState } from 'react';
import BtnNormal from "./BtnNormal";

const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-black border border-gray-700 px-10 py-12 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            <p className="text-white text-lg font-semibold tracking-widest text-center">MESSAGE SENT</p>
            <p className="text-gray-400 text-sm text-center">We'll get back to you as soon as possible.</p>
            <BtnNormal title="Close" onClick={onClose} />
        </div>
    </div>
);

const inputClass = "w-full bg-transparent border border-gray-700 text-white placeholder-gray-500 px-4 py-3 outline-none focus:border-white transition-colors text-sm";

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setForm({ name: form.name, email: form.email, message: form.message, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
        if (!form.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setShowModal(true);
    };

    return (
        <div className="bg-black py-20 px-8 md:px-16 lg:px-32 flex justify-center my-16">
            {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-2xl">
                <div>
                    <input
                        className={inputClass}
                        placeholder="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <input
                        className={inputClass}
                        placeholder="Your Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <textarea
                        className={`${inputClass} resize-none h-36`}
                        placeholder="Your Message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <div className="flex justify-center">
                    <BtnNormal title="Submit" onClick={handleSubmit} />
                </div>
            </form>
        </div>
    );
};

export default ContactUs;