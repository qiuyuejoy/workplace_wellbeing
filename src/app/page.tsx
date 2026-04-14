import Link from "next/link";
import { DIMENSIONS } from "@/lib/dimensions";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          CommCue
        </h1>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          A human-centered Communication Cue for workplace messaging. Not an auto-writer, not a
          surveillance tool — a reflective partner that helps you communicate more clearly and
          supportively.
        </p>
      </div>

      {/* Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/pre-send"
          className="group rounded-lg border border-gray-200 bg-white px-5 py-5 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">✏️</span>
            <h2 className="text-sm font-semibold text-gray-900">Pre-send Review</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Draft a message and get feedback before you send it. The coach will highlight strengths,
            flag potential issues, and offer specific suggestions tied to your goals.
          </p>
          <p className="mt-3 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
            Try it →
          </p>
        </Link>

        <Link
          href="/reflect"
          className="group rounded-lg border border-gray-200 bg-white px-5 py-5 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🔍</span>
            <h2 className="text-sm font-semibold text-gray-900">Post-hoc Reflection</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Paste a message or conversation you already sent. Get reflective feedback on what worked,
            what you might refine, and what to try next time.
          </p>
          <p className="mt-3 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
            Try it →
          </p>
        </Link>
      </div>

      {/* Dimensions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Communication Dimensions</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose which aspects of communication to focus on. You can mix and match per interaction.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DIMENSIONS.map((dim) => (
            <div
              key={dim.id}
              className="rounded-md border border-gray-200 bg-white px-4 py-3"
            >
              <h3 className="text-sm font-medium text-gray-900">{dim.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{dim.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Design Philosophy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Augmentation, not automation",
              desc: "CommCue helps you think, not think for you. You always make the final call.",
            },
            {
              title: "Your voice, preserved",
              desc: "Feedback is grounded in your goals and context, not generic writing rules.",
            },
            {
              title: "Research prototype",
              desc: "Sessions are saved locally and can be exported for study via the Session Log.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-xs font-semibold text-gray-600">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
