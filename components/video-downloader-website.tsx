'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Loader2, Youtube, Facebook, Instagram } from "lucide-react"

export function VideoDownloaderWebsite() {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // if (!isAuthenticated) {
    //   setShowAuthModal(true)
    //   return
    // }
    processDownload()
  }

  const processDownload = () => {
    setIsLoading(true)
    setResult(null)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (url && platform) {
        fetch(`/api?videoUrl=${url}&platform=${platform}`).then((res) => {
          if (res.ok) {
            res.blob().then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = `video_${platform}.mp4`; // Example file name format
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              setResult({
                success: true,
                message: `Video from ${platform} is ready for download!`
              });
            });
          } else {
            setResult({
              success: false,
              message: 'An error occurred while processing the video.'
            });
          }
        });

        setResult({
          success: true,
          message: `Video from ${platform} is ready for download!`
        })
      } else {
        setResult({
          success: false,
          message: 'Please provide both URL and platform.'
        })
      }
    }, 2000)
  }

  const handleAuth = () => {
    // Simulate authentication process
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsAuthenticated(true)
      setShowAuthModal(false)
      processDownload()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">VideoGrab</div>
          <div className="space-x-4">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
            <a href="#download" className="text-gray-600 hover:text-purple-600 transition-colors">Download</a>
            {isAuthenticated ? (
              <span className="text-green-600">Signed In</span>
            ) : (
              <Button variant="outline" onClick={() => setShowAuthModal(true)}>Sign In</Button>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Download Videos from Any Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Fast, easy, and free video downloads from your favorite social media sites.</p>
          <a href="#download" className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors">
            Start Downloading
          </a>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">YouTube Downloads</h3>
                <p className="text-gray-600">Download videos from YouTube in various qualities.</p>
              </div>
              <div className="text-center">
                <Facebook className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Facebook Videos</h3>
                <p className="text-gray-600">Grab videos from Facebook with ease.</p>
              </div>
              <div className="text-center">
                <Instagram className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instagram Reels</h3>
                <p className="text-gray-600">Save your favorite Instagram reels locally.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="download" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Download Your Video</h2>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="Paste video URL here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <Select value={platform} onValueChange={setPlatform} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </>
                  )}
                </Button>
              </form>
              {result && (
                <Alert className={`mt-4 ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <AlertTitle>{result.success ? 'Success!' : 'Error'}</AlertTitle>
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 VideoGrab. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">
            Disclaimer: This is a conceptual design. Downloading videos may violate terms of service or copyright laws.
          </p>
        </div>
      </footer>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-slate-50">
          <DialogHeader>
            <DialogTitle>Sign Up or Sign In</DialogTitle>
            <DialogDescription>
              You need to be signed in to download videos.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200">
              <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signup">Sign Up</TabsTrigger>
              <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signin">Sign In</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                <Input type="email" placeholder="Email" required />
                <Input type="password" placeholder="Password" required />
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </TabsContent>
            <TabsContent value="signin">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                <Input type="email" placeholder="Email" required />
                <Input type="password" placeholder="Password" required />
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}