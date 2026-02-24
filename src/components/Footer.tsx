export default function Footer() {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[#512d7c] font-medium text-lg">DGG Academy</p>
        <p className="text-gray-600 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
        <div className="mt-6 flex justify-center gap-8 text-sm text-gray-600">
          <a href="/privacy" className="hover:text-[#512d7c]">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#512d7c]">Terms of Service</a>
          <a href="/contact" className="hover:text-[#512d7c]">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}