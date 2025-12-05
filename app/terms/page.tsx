'use client';

import React from 'react';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
            <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Scale size={32} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
              <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText size={24} className="text-orange-400" />
                Agreement to Terms
              </h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using MasalaVault, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-400" />
                Use License
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Permission is granted to temporarily use MasalaVault for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Service Description</h2>
              <p className="text-slate-300 leading-relaxed">
                MasalaVault provides recipe discovery, pantry management, and meal planning services. We strive to provide accurate recipe information, but we cannot guarantee the accuracy, completeness, or usefulness of any recipe or cooking instruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-yellow-400" />
                Disclaimer
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                The materials on MasalaVault are provided on an 'as is' basis. MasalaVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Implied warranties or conditions of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of intellectual property or other violation of rights</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                <strong>Important:</strong> Cooking involves risks. Always follow proper food safety guidelines. We are not responsible for any foodborne illness, injury, or damage resulting from the use of recipes on this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Limitations</h2>
              <p className="text-slate-300 leading-relaxed">
                In no event shall MasalaVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MasalaVault, even if MasalaVault or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
              <p className="text-slate-300 leading-relaxed">
                The materials appearing on MasalaVault could include technical, typographical, or photographic errors. MasalaVault does not warrant that any of the materials on its website are accurate, complete, or current. MasalaVault may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Links</h2>
              <p className="text-slate-300 leading-relaxed">
                MasalaVault has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MasalaVault. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Modifications</h2>
              <p className="text-slate-300 leading-relaxed">
                MasalaVault may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

