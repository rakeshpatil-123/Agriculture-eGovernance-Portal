export interface OtherDocument {
  id: number;
  title: string;
  category: string;
}

export interface InformationItem {
  id: number;
  information_section: string;
  information_title: string;
}

export interface InformationResponse {
  status: number;
  message: string;
  data: InformationItem[];
}

export function mapInformationToDocument(item: InformationItem): OtherDocument {
  return {
    id: item.id,
    title: item.information_title,
    category: item.information_section,
  };
}
