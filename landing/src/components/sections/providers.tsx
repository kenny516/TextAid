export function Providers() {
    return (
        <section id="providers" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 max-w-xl">
                    <span className="eyebrow">Bring your own intelligence</span>
                    <h2 className="display-lg mt-3 text-white">
                        Three providers. Your keys, your call.
                    </h2>
                    <p className="mt-5 text-soft">
                        Choose the model that fits your workflow and budget. Switch in a
                        single click. Keys live only inside Chrome's secure storage —
                        we never see them.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <ProviderCard
                        name="Google Gemini"
                        tag="Recommended · Free tier"
                        model="gemini-2.5-flash · gemini-2.5-pro"
                        quota="15 req/min · 1,500/day · 1M tokens/month"
                        href="https://aistudio.google.com/app/apikey"
                        icon="/icons/google-gemini.svg"
                    />
                    <ProviderCard
                        name="OpenAI GPT-4o"
                        tag="Pay-as-you-go"
                        model="gpt-4o-mini · gpt-4o"
                        quota="Best for production-grade rewriting"
                        href="https://platform.openai.com/api-keys"
                        icon="/icons/openai.svg"
                        iconInvert
                    />
                    <ProviderCard
                        name="Anthropic Claude"
                        tag="Pay-as-you-go"
                        model="claude-haiku-4-5 · claude-sonnet-4-6"
                        quota="Cheapest completions via Haiku"
                        href="https://console.anthropic.com/settings/keys"
                        icon="/icons/anthropic.svg"
                    />
                </div>
            </div>
        </section>
    );
}

function ProviderCard({
    name,
    tag,
    model,
    quota,
    href,
    icon,
    iconInvert,
}: {
    name: string;
    tag: string;
    model: string;
    quota: string;
    href: string;
    icon?: string;
    iconInvert?: boolean;
}) {
    return (
        <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
            <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-muted">
                    {tag}
                </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
                {icon && (
                    <img
                        src={icon}
                        alt=""
                        aria-hidden
                        className={"h-9 w-9 rounded-lg object-contain" + (iconInvert ? " invert" : "")}
                    />
                )}
                <h3 className="font-display text-[1.5rem] font-medium tracking-[-0.02em] text-white">
                    {name}
                </h3>
            </div>

            <dl className="mt-6 space-y-4">
                <Row label="Models" value={model} />
                <Row label="Limits" value={quota} />
                <Row label="Storage" value="Chrome secure storage · local-only" />
            </dl>

            <div className="mt-8 text-[0.85rem]">
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-soft underline-offset-4 hover:text-white hover:underline"
                >
                    Get an API key →
                </a>
            </div>
        </article>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-6 border-t border-white/[0.08] pt-4">
            <dt className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-muted">
                {label}
            </dt>
            <dd className="text-right text-[0.88rem] text-white/85">{value}</dd>
        </div>
    );
}
