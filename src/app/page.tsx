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

        <ul className="mt-3 text-base text-gray-600 leading-relaxed list-disc pl-5 space-y-2">
          <li>
            Workplace communication shapes collaboration, performance, and well-being.
          </li>
          <li>
            Breakdowns often stem from unclear expectations, ineffective feedback, and limited emotional support.
          </li>
          <li>
            CommCue provides personalized, context-aware feedback, and reflective learning to help people improve communication skills.
          </li>
        </ul>
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
            Draft a message and get feedback before sending.
            CommCue highlights strengths, flags issues, and suggests revisions aligned with your goals.
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
            Review a past message or meeting transcript.
            CommCue surfaces what worked, what to improve, and what to try next time.
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
          Choose the qualities to focus on for this interaction; CommCue can auto choose based on the context, intent, and audience.
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
              title: "Personalized Improvement",
              desc: "Feedback is tailored to your goals while preserving your voice and strengths.",
            },
            {
              title: "Context-aware Support",
              desc: "Suggestions adapt to the relationship, situation, and communication setting.",
            },
            {
              title: "Long-term Skill Building",
              desc: "Reflection helps users identify patterns and build stronger communication habits over time.",
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
