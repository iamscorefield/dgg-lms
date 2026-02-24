export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-2xl font-bold mb-4">DGG Academy</p>
        <p>&copy; 2026 DGG Academy. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="/">Home</a> | <a href="/login">Login</a> | <a href="/signup">Sign Up</a>
        </div>
      </div>
    </footer>
  );
}