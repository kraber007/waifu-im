export interface Tag {
  description: string;
  id: number;
  is_nsfw: true;
  name: string;
}

export interface Image0 {
  extension: string;
  image_id: number;
  dominant_color: string;
  source: string;
  width: number;
  height: number;
  like: number;
  uploaded_at: string;
  is_nsfw: boolean;
  url: string;
  tags: Tag[];
}

function getTags(): Promise<any> {
  return fetch("https://api.waifu.im/tags/?full=on").then((response) =>
    response.json()
  );
}

export function getSfwTags(): Promise<Tag[]> {
  return getTags().then((data: any) => data.versatile);
}
export function getNsfwTags(): Promise<Tag[]> {
  return getTags().then((data: any) => data.nsfw);
}
export function getAllTags(): Promise<{ sfw: Tag[]; nsfw: Tag[] }> {
  return getTags().then((data: any) => {
    return { sfw: data.versatile, nsfw: data.nsfw };
  });
}

export function getRandomImages(
  selected_tags?: string[],
  excluded_tags?: string[],
  excluded_files?: number[],
  is_nsfw = 0,
  gif?: Boolean,
  order_by?: "FAVORITES" | "UPLOADED_AT",
  many = true
): Promise<Image0[]> {
  let url = "https://api.waifu.im/random/?";
  selected_tags?.forEach((tag) => (url += `&selected_tags=${tag}`));
  excluded_tags?.forEach((tag) => (url += `&excluded_tags=${tag}`));
  excluded_files?.forEach((file) => (url += `&excluded_files=${file}`));
  switch (is_nsfw) {
    case 1:
      url += "&is_nsfw=null";
      break;
    case 2:
      url += "&is_nsfw=true";
      break;
  }
  url += "&many=true";
  return fetch(url, { mode: "cors" })
    .then((response) => (response.status !== 200 ? null : response.json()))
    .then((data) => (data ? data.images : []))
    .catch((error) => {
      console.log("Error caught while getRandomImages");
      return [];
    });
}
//.slice(0, 5)
