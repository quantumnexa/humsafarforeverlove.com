import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Eye, Heart } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DashboardSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-humsafar-100 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Updated Successfully!</h1>
                <p className="text-gray-600 text-lg">
                  Your profile has been saved and is now live. You can start receiving matches and connecting with
                  potential partners.
                </p>
              </div>

              <div className="bg-humsafar50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Your profile is now visible to other members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>You can browse and connect with matches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Start receiving interests from potential partners</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile/1" legacyBehavior>
                  <Button className="bg-humsafar-600 hover:bg-humsafar700 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    View My Profile
                  </Button>
                </Link>
                <Link href="/profiles" legacyBehavior>
                  <Button
                    variant="outline"
                    className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-600 hover:text-white bg-transparent"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Browse Matches
                  </Button>
                </Link>
                <Link href="/dashboard" legacyBehavior>
                  <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
