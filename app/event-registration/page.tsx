"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, Users } from "lucide-react"

type ProfessionType = "Job" | "Business" | "Student" | "Other" | ""

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString("en-PK")}`
}

function validatePhonePK(p: string) {
  const raw = p.replace(/\s|-/g, "")
  // Accept formats: 03XXXXXXXXX (11 digits), +923XXXXXXXXX (12-13 incl +), minimum 10 digits after country code
  // Common mobile: 03xx-xxxxxxx, +92 3xx xxxxxxx
  const local = /^03\d{9}$/
  const intl = /^\+?92\s?3\d{2}\d{7}$/
  return local.test(raw) || intl.test(raw)
}

export default function EventRegistrationPage() {
  const router = useRouter()

  // Step state: 1 = form, 2 = attendees & pricing, 3 = checkout
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Form fields
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [income, setIncome] = useState("")
  const [profession, setProfession] = useState<ProfessionType>("")
  const [professionOther, setProfessionOther] = useState("")
  const [registrantIs, setRegistrantIs] = useState<string>("")
  const [maritalStatus, setMaritalStatus] = useState<string>("")

  // Attendees
  const [adults, setAdults] = useState<number>(1)
  const [children, setChildren] = useState<number>(0)

  // Pricing (discounted)
  const ADULT_PRICE = 2500
  const CHILD_PRICE = 1000
  const ADULT_ORIGINAL = 5000
  const CHILD_ORIGINAL = 2000

  const adultsTotal = useMemo(() => adults * ADULT_PRICE, [adults])
  const childrenTotal = useMemo(() => children * CHILD_PRICE, [children])
  const grandTotal = useMemo(() => adultsTotal + childrenTotal, [adultsTotal, childrenTotal])

  // Checkout
  // Payment method is fixed to PayFast; no selection state needed
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  const [paying, setPaying] = useState<boolean>(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = "Full Name is required (min 2 characters)."
    if (!phone.trim() || !validatePhonePK(phone)) e.phone = "Enter a valid Pakistan mobile number (03xx… or +92 3xx…)."
    if (!gender) e.gender = "Please select gender."
    const ageNum = Number(age)
    if (!age.trim() || isNaN(ageNum) || ageNum < 18 || ageNum > 99) e.age = "Age must be between 18 and 99."
    if (!city.trim()) e.city = "City is required."
    if (!profession) e.profession = "Select profession."
    if (profession === "Other" && !professionOther.trim()) e.professionOther = "Please specify your profession."
    if (!registrantIs) e.registrantIs = "Select who is registering."
    if (!maritalStatus) e.maritalStatus = "Select marital status."

    // Optional validations
    if (income.trim()) {
      const cleaned = income.replace(/,/g, "")
      if (!/^\d+$/.test(cleaned)) e.income = "Monthly income must be numeric."
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!Number.isInteger(adults) || adults < 0) e.adults = "Adults must be an integer ≥ 0."
    if (!Number.isInteger(children) || children < 0) e.children = "Children must be an integer ≥ 0."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const onPayNow = async () => {
    if (!agreeTerms) {
      setErrors(prev => ({ ...prev, terms: "You must agree to the event terms & policies." }))
      return
    }
    if (paying) return // prevent double clicks
    setPaying(true)
    try {
      // Persist registration server-side
      const resp = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          gender,
          age: Number(age),
          city,
          area,
          income: income,
          profession,
          profession_other: professionOther,
          registrant_is: registrantIs,
          marital_status: maritalStatus,
          adults,
          children,
          payment_method: "PayFast",
        }),
      })
      const data = await resp.json()
      if (!resp.ok || !data?.ok) {
        alert(`Error saving registration: ${data?.error || resp.status}`)
        return
      }

      const registrationId = String(data.registration_id || "")
      const totalAmount = String(data.amount_total || grandTotal)

      const successQuery = new URLSearchParams({
        registration_id: registrationId,
        total: totalAmount,
      }).toString()
      const failureQuery = new URLSearchParams({
        registration_id: registrationId,
        total: totalAmount,
      }).toString()

      // Redirect user to PayFast checkout with event-specific callbacks
      router.push(
        `/payfast?amount=${encodeURIComponent(totalAmount)}&successPath=${encodeURIComponent(
          "/event-registration/success"
        )}&failurePath=${encodeURIComponent(
          "/event-registration/failure"
        )}&successQuery=${encodeURIComponent(successQuery)}&failureQuery=${encodeURIComponent(
          failureQuery
        )}&customerName=${encodeURIComponent(fullName)}&customerMobile=${encodeURIComponent(phone)}`
      )
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner (Humsafar Theme) */}
        <div className="container mx-auto px-4 py-8">
          <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-10 py-16 px-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <CalendarDays className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Upcoming Matchmaking Events</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Event Registration
                <span className="block text-white/60">Humsafar Forever Love</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6">
                Register now to join our upcoming matchmaking or relationship-building events. Complete your details, choose attendees, and pay securely.
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-humsafar-700 font-semibold rounded-full px-4 py-2">
                <Users className="w-4 h-4" />
                <span>Limited Time Offer: 50% Off</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pb-8 max-w-3xl">

          {/* Stepper */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className={step === 1 ? "font-semibold" : "text-muted-foreground"}>1. Details</span>
            <span>›</span>
            <span className={step === 2 ? "font-semibold" : "text-muted-foreground"}>2. Attendees & Pricing</span>
            <span>›</span>
            <span className={step === 3 ? "font-semibold" : "text-muted-foreground"}>3. Checkout</span>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="e.g., Noor Bano" value={fullName} onChange={e => setFullName(e.target.value)} />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input id="phone" placeholder="+92 300 1234567" value={phone} onChange={e => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label>Gender</Label>
                  <RadioGroup className="flex gap-6 mt-2" value={gender} onValueChange={setGender}>
                    <div className="flex items-center gap-2"><RadioGroupItem value="Male" id="g-m" /><Label htmlFor="g-m">Male</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="Female" id="g-f" /><Label htmlFor="g-f">Female</Label></div>
                  </RadioGroup>
                  {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" placeholder="e.g., 28" value={age} onChange={e => setAge(e.target.value)} />
                  {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g., Lahore" value={city} onChange={e => setCity(e.target.value)} />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="area">Area / Location</Label>
                  <Input id="area" placeholder="e.g., Model Town" value={area} onChange={e => setArea(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="income">Monthly Income (PKR)</Label>
                  <Input id="income" placeholder="e.g., 75,000" value={income} onChange={e => setIncome(e.target.value)} />
                  {errors.income && <p className="text-red-600 text-sm mt-1">{errors.income}</p>}
                </div>

                <div>
                  <Label>Profession</Label>
                  <div className="mt-2">
                    <Select value={profession} onValueChange={(v: ProfessionType) => setProfession(v)}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Job">Job</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.profession && <p className="text-red-600 text-sm mt-1">{errors.profession}</p>}
                  {profession === "Other" && (
                    <div className="mt-3">
                      <Label htmlFor="professionOther">Specify Profession</Label>
                      <Input id="professionOther" placeholder="Your profession" value={professionOther} onChange={e => setProfessionOther(e.target.value)} />
                      {errors.professionOther && <p className="text-red-600 text-sm mt-1">{errors.professionOther}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Who is Registering?</Label>
                  <div className="mt-2">
                    <Select value={registrantIs} onValueChange={setRegistrantIs}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Myself">Myself</SelectItem>
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                        <SelectItem value="Relative">Relative</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.registrantIs && <p className="text-red-600 text-sm mt-1">{errors.registrantIs}</p>}
                </div>

                <div>
                  <Label>Marital Status</Label>
                  <div className="mt-2">
                    <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widow">Widow</SelectItem>
                        <SelectItem value="Widower">Widower</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.maritalStatus && <p className="text-red-600 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button onClick={goNext}>Continue</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Number of Family Members Attending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Number of Adults</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" onClick={() => setAdults(Math.max(0, adults - 1))}>-</Button>
                    <Input className="w-24 text-center" value={adults} onChange={e => setAdults(Math.max(0, parseInt(e.target.value || "0", 10)))} />
                    <Button variant="outline" onClick={() => setAdults(adults + 1)}>+</Button>
                  </div>
                  {errors.adults && <p className="text-red-600 text-sm mt-1">{errors.adults}</p>}
                </div>

                <div>
                  <Label>Number of Children</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" onClick={() => setChildren(Math.max(0, children - 1))}>-</Button>
                    <Input className="w-24 text-center" value={children} onChange={e => setChildren(Math.max(0, parseInt(e.target.value || "0", 10)))} />
                    <Button variant="outline" onClick={() => setChildren(children + 1)}>+</Button>
                  </div>
                  {errors.children && <p className="text-red-600 text-sm mt-1">{errors.children}</p>}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pricing & Discounts</p>
                  <div className="text-sm">
                    <p>Adult: <span className="line-through">{formatPKR(ADULT_ORIGINAL)}</span> → <span className="font-semibold">{formatPKR(ADULT_PRICE)}</span></p>
                    <p>Child: <span className="line-through">{formatPKR(CHILD_ORIGINAL)}</span> → <span className="font-semibold">{formatPKR(CHILD_PRICE)}</span></p>
                    <p className="text-green-700">Discount Applied: 50% Off</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p>Adults: {adults} × {formatPKR(ADULT_PRICE)} = <span className="font-semibold">{formatPKR(adultsTotal)}</span></p>
                  <p>Children: {children} × {formatPKR(CHILD_PRICE)} = <span className="font-semibold">{formatPKR(childrenTotal)}</span></p>
                  <p className="text-lg">Total: <span className="font-bold">{formatPKR(grandTotal)}</span></p>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={goNext}>Proceed to Payment</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Registrant Name:</span> {fullName}</p>
                  <p><span className="font-semibold">WhatsApp Number:</span> {phone}</p>
                  <p><span className="font-semibold">Adults / Children:</span> {adults} / {children}</p>
                  <div className="pt-2">
                    <p>Adults: {adults} × {formatPKR(ADULT_PRICE)} = {formatPKR(adultsTotal)}</p>
                    <p>Children: {children} × {formatPKR(CHILD_PRICE)} = {formatPKR(childrenTotal)}</p>
                    <p className="text-lg mt-1">Total Amount: <span className="font-bold">{formatPKR(grandTotal)}</span></p>
                  </div>
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="mt-2 text-sm">
                    <div className="px-3 py-2 border rounded bg-green-50 text-green-800">
                      PayFast (Debit/Credit Card)
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You will be redirected to PayFast to complete payment securely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(Boolean(v))} />
                  <Label htmlFor="terms" className="text-sm leading-tight">
                    I agree to the event terms & policies.
                  </Label>
                </div>
                {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={onPayNow} disabled={paying || !agreeTerms}>{paying ? "Redirecting…" : "Pay with PayFast"}</Button>
                </div>

                <div className="pt-4 text-xs text-muted-foreground space-y-2">
                  <p>Privacy notice: We use your data only for event communication and matchmaking.</p>
                  <p>
                    Refund & Cancellation Policy: Tickets are refundable up to 7 days before the event (minus processing charges). For refunds, email <a className="underline" href="mailto:support@humsafarforeverlove.com">support@humsafarforeverlove.com</a> or call +92 336 2018 777.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}