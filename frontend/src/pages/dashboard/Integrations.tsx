import { motion } from "framer-motion";
import {
  GitBranch,
  MessageSquare,
  Triangle,
  FileText,
  TrendingUp,
  Cloud,
  Train,
  BookOpen,
  Globe,
  Wifi,
} from "lucide-react";

const integrations = [
  { name: "GitHub", icon: GitBranch, desc: "Sync secrets on push" },
  { name: "Slack", icon: MessageSquare, desc: "Alert on secret rotation" },
  { name: "Vercel", icon: Triangle, desc: "Inject env at deploy" },
  { name: "Notion", icon: FileText, desc: "Document your vault" },
  { name: "Linear", icon: TrendingUp, desc: "Track secret requests" },
  { name: "Google Docs", icon: FileText, desc: "Export audit reports" },
  { name: "AWS", icon: Cloud, desc: "Secrets Manager sync" },
  { name: "Railway", icon: Train, desc: "Deploy with secrets" },
  { name: "Confluence", icon: BookOpen, desc: "Wiki integration" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

export default function Integrations() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={cardVariants} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Integrations</h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
              {integrations.length} available integrations
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                variants={cardVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5 transition-all duration-200 hover:border-white/[0.10] hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center text-xl text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Wifi className="w-5 h-5 text-white/20 flex-shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-4">{item.desc}</p>
                <button
                  type="button"
                  className="w-full h-8 text-xs font-medium rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 cursor-default"
                  disabled
                >
                  <Globe className="w-3 h-3" /> Coming Soon
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
