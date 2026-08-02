import React from 'react';
import styled from 'styled-components';

const ContentSection = styled.section`
  padding: 4rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.8;
  
  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 2.5rem 0 1rem;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
  a {
    color: ${({ theme }) => theme.colors.accent.blue};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsContent = () => {
  return (
    <ContentSection>
      <Container>
        <Content>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Dragify AI's website, services, APIs, or products (collectively, the "Services"), you agree to be bound by these Terms of Service (the "Terms"). These Terms constitute a legally binding agreement between you and Dragify AI, Inc. ("we", "us", or "Dragify AI").
          </p>
          <p>
            If you do not agree to these Terms, please do not access or use our Services. If you are accessing or using the Services on behalf of a company or organization, you represent that you have the authority to bind such entity to these Terms, in which case "you" shall refer to such entity.
          </p>
          
          <h2>2. Services Description</h2>
          <p>
            Dragify AI provides a platform that enables users to deploy, manage, and utilize artificial intelligence models through a visual, no-code interface. Our Services include, but are not limited to, AI model deployment, monitoring, scaling, and integration with third-party services.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of our Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
          </p>
          
          <h2>4. User Content</h2>
          <p>
            Our Services may allow you to upload, submit, store, send, or receive content ("User Content"). You retain ownership of any intellectual property rights that you hold in that User Content. By uploading, submitting, storing, sending, or receiving User Content, you grant Dragify AI a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such User Content solely for the purpose of providing and improving the Services.
          </p>
          
          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to use our Services to:
          </p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe the intellectual property rights of others</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Develop or deploy AI systems that could cause harm or violate human rights</li>
            <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
            <li>Attempt to gain unauthorized access to any portion of the Services</li>
          </ul>
          
          <h2>6. Fees and Payment</h2>
          <p>
            Some of our Services are offered on a subscription basis. By subscribing to our paid Services, you agree to pay all fees associated with the subscription plan you choose. We may change the fees for our Services at any time by providing notice through our Services or by email. Your continued use of the Services after a fee change becomes effective constitutes your agreement to pay the changed amount.
          </p>
          
          <h2>7. Intellectual Property Rights</h2>
          <p>
            Except for User Content, all content, software, and technology associated with our Services are owned by Dragify AI or its licensors and are protected by copyright, trademark, patent, and other intellectual property laws. You may not modify, reproduce, distribute, create derivative works of, publicly display, or publicly perform any of our content, software, or technology without our explicit permission.
          </p>
          
          <h2>8. Data Privacy</h2>
          <p>
            Our Privacy Policy, available at <a href="/privacy">dragify.ai/privacy</a>, describes how we collect, use, and share information. By using our Services, you agree to our collection, use, and sharing of information as described in our Privacy Policy.
          </p>
          
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your access to our Services at any time, with or without cause, and with or without notice. Upon termination, your right to use the Services will immediately cease, and you must cease all use of the Services and delete any copies of software associated with the Services.
          </p>
          
          <h2>10. Disclaimers</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
          
          <h2>11. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL DRAGIFY AI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
          </p>
          
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located in San Francisco County, California.
          </p>
          
          <h2>13. Changes to These Terms</h2>
          <p>
            We may revise these Terms from time to time. The most current version will always be posted on our website. If a revision, in our sole discretion, is material, we will notify you through the Services or by email. By continuing to access or use the Services after revisions become effective, you agree to be bound by the revised Terms.
          </p>
          
          <h2>14. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at contact@dragify.ai.
          </p>
        </Content>
      </Container>
    </ContentSection>
  );
};

export default TermsContent;