import React from 'react';
import Card from '../ui/Card';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main privacy policy content"
      >
        Skip to main content
      </a>
      
      <Card className="p-8">
        <header>
          <h1 
            id="privacy-policy-title"
            className="text-3xl font-bold text-gray-900 mb-6"
            tabIndex="-1"
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8" aria-label="Last updated date">
            Last updated: <time dateTime={new Date().toISOString().split('T')[0]}>
              {new Date().toLocaleDateString()}
            </time>
          </p>
        </header>

        <main id="main-content" role="main" aria-labelledby="privacy-policy-title">
          <nav aria-label="Privacy policy sections" className="mb-8">
            <h2 className="sr-only">Table of Contents</h2>
            <ol className="list-decimal list-inside text-sm text-primary-600 space-y-1">
              <li><a href="#introduction" className="hover:underline focus:underline focus:outline-none">Introduction</a></li>
              <li><a href="#information-collect" className="hover:underline focus:underline focus:outline-none">Information We Collect</a></li>
              <li><a href="#how-we-use" className="hover:underline focus:underline focus:outline-none">How We Use Your Information</a></li>
              <li><a href="#data-security" className="hover:underline focus:underline focus:outline-none">Data Security</a></li>
              <li><a href="#data-sharing" className="hover:underline focus:underline focus:outline-none">Data Sharing and Disclosure</a></li>
              <li><a href="#your-rights" className="hover:underline focus:underline focus:outline-none">Your Rights and Choices</a></li>
              <li><a href="#data-retention" className="hover:underline focus:underline focus:outline-none">Data Retention</a></li>
              <li><a href="#international-transfers" className="hover:underline focus:underline focus:outline-none">International Data Transfers</a></li>
              <li><a href="#children-privacy" className="hover:underline focus:underline focus:outline-none">Children's Privacy</a></li>
              <li><a href="#policy-changes" className="hover:underline focus:underline focus:outline-none">Changes to This Policy</a></li>
              <li><a href="#contact-us" className="hover:underline focus:underline focus:outline-none">Contact Us</a></li>
            </ol>
          </nav>

          <div className="space-y-8">
          <section aria-labelledby="introduction-heading">
            <h2 id="introduction" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Sympto ("we," "our," or "us"). We are committed to protecting your privacy and 
              ensuring the security of your personal health information. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you use our health assessment 
              platform.
            </p>
          </section>

          <section aria-labelledby="information-collect-heading">
            <h2 id="information-collect" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                  <li>Name and email address</li>
                  <li>Date of birth</li>
                  <li>Account credentials (encrypted)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Health Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                  <li>Symptom assessments and severity ratings</li>
                  <li>Lifestyle factors (diet, exercise, habits)</li>
                  <li>Laboratory test results (when provided)</li>
                  <li>AI-generated health insights and recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and interaction data</li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="how-we-use-heading">
            <h2 id="how-we-use" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2" role="list">
              <li>Provide personalized health assessments and AI-powered insights</li>
              <li>Track your health progress over time</li>
              <li>Improve our services and develop new features</li>
              <li>Communicate with you about your account and our services</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section aria-labelledby="data-security-heading">
            <h2 id="data-security" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              4. Data Security
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                <li>End-to-end encryption for all sensitive health data</li>
                <li>Secure HTTPS connections for all data transmission</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Data backup and recovery procedures</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="data-sharing-heading">
            <h2 id="data-sharing" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              5. Data Sharing and Disclosure
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal health information. We may share your 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>In case of business transfer or merger (with continued privacy protection)</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="your-rights-heading">
            <h2 id="your-rights" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              6. Your Rights and Choices
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1" role="list">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="data-retention-heading">
            <h2 id="data-retention" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              7. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy. Health assessment data is retained 
              for up to 7 years or until you request deletion, whichever comes first. Account 
              information is deleted within 30 days of account closure.
            </p>
          </section>

          <section aria-labelledby="international-transfers-heading">
            <h2 id="international-transfers" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with this privacy policy and applicable data protection laws.
            </p>
          </section>

          <section aria-labelledby="children-privacy-heading">
            <h2 id="children-privacy" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian 
              and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section aria-labelledby="policy-changes-heading">
            <h2 id="policy-changes" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" 
              date. Your continued use of our service after such changes constitutes acceptance of 
              the updated policy.
            </p>
          </section>

          <section aria-labelledby="contact-us-heading">
            <h2 id="contact-us" className="text-2xl font-semibold text-gray-900 mb-4" tabIndex="-1">
              11. Contact Us
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <address className="bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-lg not-italic">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Email:</span>{' '}
                    <a 
                      href="mailto:privacy@sympto.com" 
                      className="text-primary-600 hover:text-primary-700 focus:underline focus:outline-none"
                      aria-label="Send email to privacy@sympto.com"
                    >
                      privacy@sympto.com
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Address:</span> [Your Company Address]
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>{' '}
                    <a 
                      href="tel:[Your Phone Number]" 
                      className="text-primary-600 hover:text-primary-700 focus:underline focus:outline-none"
                      aria-label="Call [Your Phone Number]"
                    >
                      [Your Phone Number]
                    </a>
                  </div>
                </div>
              </address>
            </div>
          </section>
        </div>
      </main>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;