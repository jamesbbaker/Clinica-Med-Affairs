import React from "react";
import Navbar from "../../components/Navbar";

const termsAndConditions = [
  {
    section: "Introduction",
    content: `These Terms and conditions apply to this website and to the transactions related to our products and services. You may be bound by additional contracts related to your relationship with us or any products or services that you receive from us. If any provisions of the additional contracts conflict with any provisions of these Terms, the provisions of these additional contracts will control and prevail.`,
  },
  {
    section: "Binding",
    content: `By registering with, accessing, or otherwise using this website, you hereby agree to be bound by these Terms and conditions set forth below. The mere use of this website implies the knowledge and acceptance of these Terms and conditions. In some particular cases, we can also ask you to explicitly agree.`,
  },
  {
    section: "Intellectual property",
    content: `We or our licensors own and control all of the copyright and other intellectual property rights in the website and the data, information, and other resources displayed by or accessible within the website.`,
  },
  {
    section: "All the rights are reserved",
    content: `Unless specific content dictates otherwise, you are not granted a license or any other right under Copyright, Trademark, Patent, or other Intellectual Property Rights. This means that you will not use, copy, reproduce, perform, display, distribute, embed into any electronic medium, alter, reverse engineer, decompile, transfer, download, transmit, monetize, sell, market, or commercialize any resources on this website in any form, without our prior written permission, except and only insofar as otherwise stipulated in regulations of mandatory law (such as the right to quote).`,
  },
  {
    section: "Third-party property",
    content: `Our website may include hyperlinks or other references to other party’s websites. We do not monitor or review the content of other party’s websites which are linked to from this website. Products or services offered by other websites shall be subject to the applicable Terms and Conditions of those third parties. Opinions expressed or material appearing on those websites are not necessarily shared or endorsed by us.
  
  We will not be responsible for any privacy practices or content of these sites. You bear all risks associated with the use of these websites and any related third-party services. We will not accept any responsibility for any loss or damage in whatever manner, however caused, resulting from your disclosure to third parties of personal information.`,
  },
  {
    section: "Responsible use",
    content: `By visiting our website, you agree to use it only for the purposes intended and as permitted by these Terms, any additional contracts with us, and applicable laws, regulations, and generally accepted online practices and industry guidelines. You must not use our website or services to use, publish or distribute any material which consists of (or is linked to) malicious computer software; use data collected from our website for any direct marketing activity, or conduct any systematic or automated data collection activities on or in relation to our website.
  
  Engaging in any activity that causes, or may cause, damage to the website or that interferes with the performance, availability, or accessibility of the website is strictly prohibited.`,
  },
  {
    section: "Idea submission",
    content: `Do not submit any ideas, inventions, works of authorship, or other information that can be considered your own intellectual property that you would like to present to us unless we have first signed an agreement regarding the intellectual property or a non-disclosure agreement. If you disclose it to us absent such written agreement, you grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, store, adapt, publish, translate and distribute your content in any existing or future media.`,
  },
  {
    section: "Termination of use",
    content: `We may, in our sole discretion, at any time modify or discontinue access to, temporarily or permanently, the website or any Service thereon. You agree that we will not be liable to you or any third party for any such modification, suspension or discontinuance of your access to, or use of, the website or any content that you may have shared on the website. You will not be entitled to any compensation or other payment, even if certain features, settings, and/or any Content you have contributed or have come to rely on, are permanently lost. You must not circumvent or bypass, or attempt to circumvent or bypass, any access restriction measures on our website.`,
  },
  {
    section: "Warranties and liability",
    content: `Nothing in this section will limit or exclude any warranty implied by law that it would be unlawful to limit or to exclude. This website and all content on the website are provided on an “as is” and “as available” basis and may include inaccuracies or typographical errors. We expressly disclaim all warranties of any kind, whether express or implied, as to the availability, accuracy, or completeness of the Content. We make no warranty that:
  
  this website or our content will meet your requirements;
  this website will be available on an uninterrupted, timely, secure, or error-free basis.
  Nothing on this website constitutes or is meant to constitute, legal, financial or medical advice of any kind. If you require advice you should consult an appropriate professional.
  
  The following provisions of this section will apply to the maximum extent permitted by applicable law and will not limit or exclude our liability in respect of any matter which it would be unlawful or illegal for us to limit or to exclude our liability. In no event will we be liable for any direct or indirect damages (including any damages for loss of profits or revenue, loss or corruption of data, software or database, or loss of or harm to property or data) incurred by you or any third party, arising from your access to, or use of, our website.
  
  Except to the extent any additional contract expressly states otherwise, our maximum liability to you for all damages arising out of or related to the website or any products and services marketed or sold through the website, regardless of the form of legal action that imposes liability (whether in contract, equity, negligence, intended conduct, tort or otherwise) will be limited to the total price that you paid to us to purchase such products or services or use the website. Such limit will apply in the aggregate to all of your claims, actions and causes of action of every kind and nature.`,
  },
  {
    section: "Privacy",
    content: `To access our website and/or services, you may be required to provide certain information about yourself as part of the registration process. You agree that any information you provide will always be accurate, correct, and up to date.`,
  },
  {
    section: "Export restrictions / Legal compliance",
    content: `Access to the website from territories or countries where the Content or purchase of the products or Services sold on the website is illegal is prohibited. You may not use this website in violation of export laws and regulations of United States.`,
  },
  {
    section: "Assignment",
    content: `You may not assign, transfer or sub-contract any of your rights and/or obligations under these Terms and conditions, in whole or in part, to any third party without our prior written consent. Any purported assignment in violation of this Section will be null and void.`,
  },
  {
    section: "Breaches of these Terms and conditions",
    content: `Without prejudice to our other rights under these Terms and Conditions, if you breach these Terms and Conditions in any way, we may take such action as we deem appropriate to deal with the breach, including temporarily or permanently suspending your access to the website, contacting your internet service provider to request that they block your access to the website, and/or commence legal action against you.`,
  },
  {
    section: "Force majeure",
    content: `Except for obligations to pay money hereunder, no delay, failure or omission by either party to carry out or observe any of its obligations hereunder will be deemed to be a breach of these Terms and conditions if and for as long as such delay, failure or omission arises from any cause beyond the reasonable control of that party.`,
  },
  {
    section: "Indemnification",
    content: `You agree to indemnify, defend and hold us harmless, from and against any and all claims, liabilities, damages, losses and expenses, relating to your violation of these Terms and conditions, and applicable laws, including intellectual property rights and privacy rights. You will promptly reimburse us for our damages, losses, costs and expenses relating to or arising out of such claims.`,
  },
  {
    section: "Waiver",
    content: `Failure to enforce any of the provisions set out in these Terms and Conditions and any Agreement, or failure to exercise any option to terminate, shall not be construed as waiver of such provisions and shall not affect the validity of these Terms and Conditions or of any Agreement or any part thereof, or the right thereafter to enforce each and every provision.`,
  },
  {
    section: "Language",
    content: `These Terms and Conditions will be interpreted and construed exclusively in English. All notices and correspondence will be written exclusively in that language.`,
  },
  {
    section: "Entire agreement",
    content: `These Terms and Conditions shall constitute the entire agreement between you and Clinica AI, Corp. in relation to your use of this website.`,
  },
  {
    section: "Updating of these Terms and conditions",
    content: `We may update these Terms and Conditions from time to time. It is your obligation to periodically check these Terms and Conditions for changes or updates. The date provided at the beginning of these Terms and Conditions is the latest revision date. Changes to these Terms and Conditions will become effective upon such changes being posted to this website. Your continued use of this website following the posting of changes or updates will be considered notice of your acceptance to abide by and be bound by these Terms and Conditions.`,
  },
  {
    section: "Choice of Law and Jurisdiction",
    content: `These Terms and Conditions shall be governed by the laws of United States. Any disputes relating to these Terms and Conditions shall be subject to the jurisdiction of the courts of United States. If any part or provision of these Terms and Conditions is found by a court or other authority to be invalid and/or unenforceable under applicable law, such part or provision will be modified, deleted and/or enforced to the maximum extent permissible so as to give effect to the intent of these Terms and Conditions. The other provisions will not be affected.`,
  },
  {
    section: "Contact information",
    content: `This website is owned and operated by Clinica AI, Corp.. You may contact us regarding these Terms and Conditions through our contact page.`,
  },
];

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="container pt-24 mx-auto p-10">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated on June 1, 2022
        </p>
        {termsAndConditions.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{section.section}</h2>
            <p className="text-base text-gray-700 whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default TermsAndConditions;
