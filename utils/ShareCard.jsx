"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ShareCard({
  isOpen,
  onClose,
  contentTitle,
  contentType,
  contentUrl,
}) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(contentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Prepare share URLs
  const getShareMessage = () => {
    switch (contentType) {
      case "university":
        return `Check out this university: ${contentTitle}`;
      case "blog":
        return `Check out this article: ${contentTitle}`;
      case "major":
        return `Check out this major: ${contentTitle}`;
      case "course":
        return `Check out this course: ${contentTitle}`;
      default:
        return `Check this out: ${contentTitle}`;
    }
  };

  const shareMessage = encodeURIComponent(getShareMessage());
  const encodedUrl = encodeURIComponent(contentUrl);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${shareMessage}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareMessage} ${encodedUrl}`,
  };

  const socialMedia = [
    {
      nameEn: "Twitter",
      nameAr: "تويتر",
      icon: <Twitter className="w-5 h-5" />,
      url: shareUrls.twitter,
    },
    {
      nameEn: "Facebook",
      nameAr: "فيسبوك",
      icon: <Facebook className="w-5 h-5" />,
      url: shareUrls.facebook,
    },
    {
      nameEn: "LinkedIn",
      nameAr: "لينكد إن",
      icon: <Linkedin className="w-5 h-5" />,
      url: shareUrls.linkedin,
    },
    {
      nameEn: "Telegram",
      nameAr: "تليغرام",
      icon: <Send className="w-5 h-5" />,
      url: shareUrls.telegram,
    },
    {
      nameEn: "WhatsApp",
      nameAr: "واتساب",
      icon: <MessageCircle className="w-5 h-5" />,
      url: shareUrls.whatsapp,
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltl"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        data-aos="zoom-in"
        data-aos-duration="300"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {language === "ar"
              ? "شارك هذه الدورة مع أصدقائك"
              : "Share this course with your friends"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Copy link section */}
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={contentUrl}
                readOnly
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Social sharing options */}
          <div className="grid grid-cols-5 gap-4">
            {socialMedia.map((platform, index) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2"
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  {platform.icon}
                </div>
                <span className="text-xs text-gray-600">
                  {language === "ar" ? platform.nameAr : platform.nameEn}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
