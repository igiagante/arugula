import {
  Cannabis,
  Citrus,
  Cloud,
  Coffee,
  FlaskConical,
  Flower,
  Leaf,
} from "lucide-react";

export const getTerpeneIcon = (terpene: string) => {
  const lowerTerpene = terpene.toLowerCase().trim();
  if (lowerTerpene.includes("limonene"))
    return <Citrus className="size-3 text-yellow-500" aria-label="Limonene" />;
  if (lowerTerpene.includes("myrcene"))
    return <Cloud className="size-3 text-blue-400" aria-label="Myrcene" />;
  if (lowerTerpene.includes("pinene"))
    return <Cannabis className="size-3 text-green-500" aria-label="Pinene" />;
  if (lowerTerpene.includes("linalool"))
    return <Flower className="size-3 text-purple-400" aria-label="Linalool" />;
  if (lowerTerpene.includes("caryophyllene"))
    return (
      <Coffee className="size-3 text-amber-700" aria-label="Caryophyllene" />
    );
  if (lowerTerpene.includes("humulene"))
    return <Leaf className="size-3 text-green-600" aria-label="Humulene" />;
  if (lowerTerpene.includes("terpinolene"))
    return <Cloud className="size-3 text-teal-500" aria-label="Terpinolene" />;
  if (lowerTerpene.includes("ocimene"))
    return <Flower className="size-3 text-emerald-400" aria-label="Ocimene" />;
  return <FlaskConical className="size-3 text-gray-500" aria-label={terpene} />;
};
