'use client';

import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050010] text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Shield size={32} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock size={24} className="text-orange-400" />
                Introduction
              </h2>
              <p className="text-slate-300 leading-relaxed">
                MasalaVault ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye size={24} className="text-orange-400" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Pantry ingredients and preferences</li>
                    <li>Saved recipes and collections</li>
                    <li>Recipe ratings and reviews</li>
                    <li>Meal planning data</li>
                    <li>Cooking history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Usage data and analytics</li>
                    <li>Device information</li>
                    <li>Browser type and version</li>
                    <li>IP address (anonymized)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Provide and improve our services</li>
                <li>Personalize your cooking experience</li>
                <li>Recommend recipes based on your preferences</li>
                <li>Analyze usage patterns to enhance functionality</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Storage</h2>
              <p className="text-slate-300 leading-relaxed">
                All your data is stored locally in your browser using localStorage. We do not transmit, store, or have access to your personal data on our servers. Your information remains private and secure on your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use cookies to enhance your experience. You can manage your cookie preferences through the cookie consent banner. Types of cookies we use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong>Necessary Cookies:</strong> Required for the website to function</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising (if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Access your personal data</li>
                <li>Delete your data at any time (clear browser storage)</li>
                <li>Modify your cookie preferences</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-slate-300 leading-relaxed">
                We may use third-party services for analytics and image hosting. These services have their own privacy policies. We use Unsplash for recipe images, which may collect usage data in accordance with their privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our website or email.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

