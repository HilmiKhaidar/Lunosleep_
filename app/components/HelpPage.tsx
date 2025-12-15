'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Smartphone, Download, Bell, Heart, BarChart3, Calendar, HelpCircle } from 'lucide-react'

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [expandedInstall, setExpandedInstall] = useState<string | null>(null)

  const faqData = [
    {
      question: "Apa itu Lunosleep dan bagaimana cara kerjanya?",
      answer: "Lunosleep adalah aplikasi kesadaran tidur yang membantu Anda memahami pola istirahat secara manual dan mindful. Berbeda dengan sleep tracker otomatis, Lunosleep mendorong kesadaran diri melalui pencatatan manual waktu tidur, bangun, dan perasaan setelah istirahat."
    },
    {
      question: "Apakah data saya aman dan privat?",
      answer: "Ya, semua data Anda disimpan secara lokal di perangkat Anda menggunakan Local Storage. Tidak ada data yang dikirim ke server atau cloud. Data Anda tetap pribadi dan hanya dapat diakses oleh Anda."
    },
    {
      question: "Mengapa harus mencatat tidur secara manual?",
      answer: "Pencatatan manual mendorong kesadaran diri (mindfulness) terhadap kebiasaan tidur. Ini membantu Anda lebih memperhatikan sinyal tubuh dan membangun hubungan yang lebih sehat dengan waktu istirahat, tanpa ketergantungan pada teknologi."
    },
    {
      question: "Bagaimana cara mengatur pengingat tidur?",
      answer: "Anda dapat mengatur pengingat di halaman Pengaturan. Pilih waktu yang sesuai untuk reminder tidur (biasanya 30-60 menit sebelum waktu tidur ideal). Pastikan notifikasi browser sudah diizinkan."
    },
    {
      question: "Apa arti dari skor konsistensi?",
      answer: "Skor konsistensi menunjukkan seberapa teratur pola tidur Anda berdasarkan variasi durasi tidur. Skor tinggi (70-100) menunjukkan pola yang konsisten, sementara skor rendah menunjukkan variasi yang besar dalam durasi tidur."
    },
    {
      question: "Bagaimana cara backup data saya?",
      answer: "Saat ini data disimpan lokal di browser. Untuk backup, Anda bisa menggunakan fitur export data di Pengaturan. Kami merekomendasikan untuk tidak menghapus data browser atau menggunakan mode incognito untuk penggunaan jangka panjang."
    },
    {
      question: "Apakah ada target tidur yang harus dicapai?",
      answer: "Lunosleep tidak menetapkan target kaku. Setiap orang memiliki kebutuhan tidur yang berbeda. Aplikasi ini fokus pada kesadaran dan pemahaman pola pribadi Anda, bukan mencapai standar tertentu."
    },
    {
      question: "Bagaimana cara menghapus atau mengedit data lama?",
      answer: "Saat ini Anda dapat mengedit data hari ini melalui tombol Edit. Untuk data lama atau penghapusan, fitur ini akan ditambahkan di update mendatang. Data dapat direset melalui Pengaturan jika diperlukan."
    }
  ]

  const installGuides = {
    ios: {
      title: "iPhone/iPad (Safari)",
      steps: [
        "Buka Lunosleep di Safari",
        "Tap tombol 'Share' (kotak dengan panah ke atas) di bagian bawah",
        "Scroll ke bawah dan pilih 'Add to Home Screen'",
        "Ubah nama jika perlu, lalu tap 'Add'",
        "Aplikasi akan muncul di home screen Anda"
      ]
    },
    android: {
      title: "Android (Chrome)",
      steps: [
        "Buka Lunosleep di Chrome",
        "Tap menu (3 titik) di pojok kanan atas",
        "Pilih 'Add to Home screen' atau 'Install app'",
        "Konfirmasi dengan tap 'Add' atau 'Install'",
        "Aplikasi akan muncul di home screen dan app drawer"
      ]
    },
    desktop: {
      title: "Desktop (Chrome/Edge)",
      steps: [
        "Buka Lunosleep di browser",
        "Cari ikon install (+) di address bar atau menu",
        "Klik 'Install Lunosleep' atau 'Add to Desktop'",
        "Konfirmasi instalasi",
        "Aplikasi akan muncul sebagai aplikasi desktop"
      ]
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bantuan & Panduan</h2>
        <p className="text-gray-600">Pelajari cara menggunakan Lunosleep secara optimal</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center hover-lift">
          <Smartphone className="w-8 h-8 text-mint-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Install Aplikasi</h3>
          <p className="text-sm text-gray-600">Pasang di home screen untuk akses mudah</p>
        </div>
        
        <div className="card text-center hover-lift">
          <Bell className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Atur Pengingat</h3>
          <p className="text-sm text-gray-600">Notifikasi lembut untuk rutinitas tidur</p>
        </div>
        
        <div className="card text-center hover-lift">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Tips Tidur Sehat</h3>
          <p className="text-sm text-gray-600">Panduan untuk kualitas tidur yang lebih baik</p>
        </div>
      </div>

      {/* Install Guide */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-mint-600" />
          Cara Install Aplikasi ke Home Screen
        </h3>
        
        <div className="space-y-4">
          {Object.entries(installGuides).map(([key, guide]) => (
            <div key={key} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedInstall(expandedInstall === key ? null : key)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">{guide.title}</span>
                {expandedInstall === key ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              {expandedInstall === key && (
                <div className="px-4 pb-4">
                  <ol className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-mint-100 text-mint-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Guide */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Panduan Fitur</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-mint-50 rounded-lg p-4">
            <Heart className="w-6 h-6 text-mint-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Check-in Harian</h4>
            <p className="text-sm text-gray-600">
              Catat waktu tidur, bangun, dan perasaan Anda setelah istirahat. 
              Fokus pada kesadaran, bukan kesempurnaan.
            </p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4">
            <BarChart3 className="w-6 h-6 text-teal-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Dashboard</h4>
            <p className="text-sm text-gray-600">
              Lihat statistik dan pola tidur Anda. Analisis durasi, konsistensi, 
              dan distribusi kualitas tidur.
            </p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <Calendar className="w-6 h-6 text-indigo-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Wawasan Mingguan</h4>
            <p className="text-sm text-gray-600">
              Tren dan pola mingguan untuk memahami perubahan 
              kebiasaan tidur dari waktu ke waktu.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {expandedFAQ === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Better Sleep */}
      <div className="card bg-gradient-to-br from-mint-50 to-teal-50 border-mint-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips untuk Tidur yang Lebih Baik</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Sebelum Tidur:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Hindari layar 1 jam sebelum tidur</li>
              <li>• Ciptakan rutinitas yang menenangkan</li>
              <li>• Jaga suhu kamar sejuk (18-22°C)</li>
              <li>• Hindari kafein 6 jam sebelum tidur</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Lingkungan Tidur:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Kamar gelap dan tenang</li>
              <li>• Kasur dan bantal yang nyaman</li>
              <li>• Ventilasi udara yang baik</li>
              <li>• Gunakan earplug jika perlu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Butuh Bantuan Lebih Lanjut?</h3>
        <p className="text-gray-600 mb-4">
          Tim Lunetix siap membantu Anda dengan pertanyaan atau masalah teknis
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="mailto:support@lunetix.health" 
            className="btn-secondary"
          >
            Email Support
          </a>
          <a 
            href="https://lunetix.health/help" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Pusat Bantuan
          </a>
        </div>
      </div>
    </div>
  )
}