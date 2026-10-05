"""Generate LUMA redesign imagery with OpenRouter Image API, model fixed to Seedream 5.0 Flash.
Key is read from ~/.hermes/.env and never printed."""
import base64, json, os, sys, urllib.request, concurrent.futures as cf

MODEL = "bytedance-seed/seedream-5-0-flash"
OUT = sys.argv[1]
ONLY = set(sys.argv[2:])


def key():
    for line in open(os.path.expanduser("~/.hermes/.env")):
        if line.startswith("OPENROUTER_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("no key")


NO_TEXT = " Absolutely no text, no letters, no signage lettering, no logos, no watermarks."
JOBS = {
    "night-street": ("16:9", "2K",
        "Cinematic night photograph of a quiet street in downtown Cairo well after midnight. A small independent "
        "clothing boutique with its metal roll-down shutter pulled almost closed, a thin strip of warm light leaking "
        "from beneath it. Wet asphalt reflects deep cobalt blue and hot magenta neon glow from signs out of frame. "
        "Ornate old Belle Epoque facades with balconies above, dark windows. No people. Deep navy shadows, "
        "rich saturated color, shallow depth of field, subtle 35mm film grain, composition leaves dark empty space on the left." + NO_TEXT),
    "dawn-rooftops": ("21:9", "2K",
        "Wide film photograph of Cairo rooftops at first light. Soft sky gradient from lavender and periwinkle at the top "
        "to peach and warm cream haze near the horizon. Distant silhouettes of minarets, water tanks and satellite dishes, "
        "a laundry line, a few pigeons in flight. Calm, airy, hopeful, pastel, gentle grain." + NO_TEXT),
    "hoodie": ("1:1", "1K",
        "Studio product photograph of a black oversized cotton hoodie on a wooden hanger against a saturated cobalt blue "
        "seamless backdrop, soft rim light, crisp fabric texture, minimal, centered." + NO_TEXT),
    "slip-dress": ("1:1", "1K",
        "Studio product photograph of a champagne satin slip dress on a wooden hanger against a vivid magenta pink "
        "seamless backdrop, soft glossy highlights on the satin, minimal, centered." + NO_TEXT),
    "light-trails": ("21:9", "2K",
        "Abstract long exposure photograph of flowing neon light trails in electric cobalt blue, violet and a thin "
        "accent of magenta, sweeping curves over pure black, soft bloom, elegant, lots of negative space." + NO_TEXT),
}


def run(name):
    ar, res, prompt = JOBS[name]
    body = json.dumps({"model": MODEL, "prompt": prompt, "aspect_ratio": ar, "resolution": res, "n": 1}).encode()
    req = urllib.request.Request("https://openrouter.ai/api/v1/images", data=body, method="POST",
        headers={"Authorization": f"Bearer {key()}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        return f"{name}: HTTP {e.code} {e.read()[:300]!r}"
    item = d["data"][0]
    ext = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp"}.get(item.get("media_type"), "png")
    path = os.path.join(OUT, f"{name}.{ext}")
    open(path, "wb").write(base64.b64decode(item["b64_json"]))
    return f"{name}: saved {path} cost={d.get('usage', {}).get('cost')}"


os.makedirs(OUT, exist_ok=True)
names = [n for n in JOBS if not ONLY or n in ONLY]
with cf.ThreadPoolExecutor(5) as ex:
    for line in ex.map(run, names):
        print(line)
