/* eslint-disable react/prop-types */
import { motion } from "framer-motion"


export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
          </motion.div>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

