import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Star, Users, Zap, Shield, Globe, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'PDF to HTML Converter - Free Online Tool | ScrollForge',
  description: 'Convert PDF to HTML instantly with our free online converter. No sign-up, no watermarks, unlimited conversions. Transform PDFs into responsive websites in seconds.',
  keywords: 'pdf to html, pdf to html converter, convert pdf to html online, pdf to html free, pdf to website, pdf to webpage, pdf html converter, pdf to html online free, pdf to html no watermark',
  alternates: {
    canonical: 'https://scroll-forge.vercel.app/pdf-to-html',
  },
};

export default function PDFToHTMLPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            PDF to HTML Converter
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your PDF documents into responsive HTML websites instantly. 
            Free, fast, and secure - no sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/upload">
              <Button size="lg" className="text-lg px-8 py-6">
                Convert PDF to HTML Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              No Sign-up Required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              100% Free
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              No Watermarks
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose ScrollForge for PDF to HTML Conversion?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Convert PDFs to HTML in seconds. Our advanced processing engine ensures 
                quick turnaround times for all file sizes.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your files are encrypted and protected. We use secure tokens and never 
                share your documents with third parties.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Responsive Output</h3>
              <p className="text-muted-foreground">
                Generated HTML is mobile-friendly and responsive, ensuring perfect 
                display on all devices and screen sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How to Convert PDF to HTML
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your PDF</h3>
              <p className="text-muted-foreground">
                Simply drag and drop or click to upload your PDF file. 
                We support all PDF versions and sizes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Conversion</h3>
              <p className="text-muted-foreground">
                Our AI-powered engine converts your PDF to clean, 
                semantic HTML code automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Your Website</h3>
              <p className="text-muted-foreground">
                Get instant access to your converted HTML website with 
                a unique link you can share anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">PDFs Converted</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-muted-foreground">User Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Free Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">
                Is the PDF to HTML converter really free?
              </h3>
              <p className="text-muted-foreground">
                Yes! ScrollForge is 100% free with no hidden costs. You can convert 
                unlimited PDFs without any charges or subscription fees.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">
                Do I need to create an account?
              </h3>
              <p className="text-muted-foreground">
                No sign-up required! Simply upload your PDF and get your converted 
                HTML instantly. We believe in simplicity and user privacy.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">
                What happens to my uploaded PDFs?
              </h3>
              <p className="text-muted-foreground">
                Your PDFs are processed securely and stored temporarily with a unique 
                access token. Only you can access your converted documents.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">
                Can I convert large PDF files?
              </h3>
              <p className="text-muted-foreground">
                Yes! Our converter handles PDFs of all sizes efficiently. Large files 
                may take a bit longer, but the conversion quality remains excellent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Convert Your PDF to HTML?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust ScrollForge for their PDF conversion needs.
          </p>
          <Link href="/upload">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Converting Now - It's Free!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}