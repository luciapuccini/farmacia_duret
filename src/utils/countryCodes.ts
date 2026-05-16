export type CountryCode = {
	iso: string;
	name: string;
	dial: string;
	flag: string;
};

export const COUNTRY_CODES: readonly CountryCode[] = [
	{ iso: "AR", name: "Argentina", dial: "+54", flag: "\u{1F1E6}\u{1F1F7}" },
	{ iso: "UY", name: "Uruguay", dial: "+598", flag: "\u{1F1FA}\u{1F1FE}" },
	{ iso: "CL", name: "Chile", dial: "+56", flag: "\u{1F1E8}\u{1F1F1}" },
	{ iso: "BR", name: "Brasil", dial: "+55", flag: "\u{1F1E7}\u{1F1F7}" },
	{ iso: "PY", name: "Paraguay", dial: "+595", flag: "\u{1F1F5}\u{1F1FE}" },
	{ iso: "BO", name: "Bolivia", dial: "+591", flag: "\u{1F1E7}\u{1F1F4}" },
	{ iso: "PE", name: "Perú", dial: "+51", flag: "\u{1F1F5}\u{1F1EA}" },
	{ iso: "MX", name: "México", dial: "+52", flag: "\u{1F1F2}\u{1F1FD}" },
	{ iso: "CO", name: "Colombia", dial: "+57", flag: "\u{1F1E8}\u{1F1F4}" },
	{ iso: "ES", name: "España", dial: "+34", flag: "\u{1F1EA}\u{1F1F8}" },
];

export const DEFAULT_COUNTRY_DIAL = "+54";
