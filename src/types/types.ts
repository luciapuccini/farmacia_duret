export type TCatalogUrlParams = {
	category: string;
	subcategory?: string;
	filter?: string;
};

export type TFilters = {
	name: string;
	url: string;
};

export type TSubcategory = {
	name: string;
	filters?: TFilters[];
};

export type TCategory = {
	name: string;
	subcategories?: TSubcategory[];
};
