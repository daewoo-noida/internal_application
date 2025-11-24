export default function Page404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  )
}
