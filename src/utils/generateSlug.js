async function userSlugExists(slug) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/users/${slug}`
    );

    if (response.ok) {
      return true;
    } else if (response.status === 404) {
      return false;
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("Error checking slug:", error);
    return false;
  }
}

async function recipeSlugExists(slug) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/recipes/${slug}`
    );
    if (response.ok) {
      return true;
    } else if (response.status === 404) {
      return false;
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("Error checking slug:", error);
    return false;
  }
}

export async function generateUserSlug(firstName, lastName) {
  const slugify = (str) => {
    return str
      .normalize("NFD") // décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // remplace caractères non alphanumériques par des tirets
      .replace(/^-+|-+$/g, "") // nettoie les tirets en début/fin
      .replace(/-+/g, "-"); // fusionne les tirets multiples
  };
  const slugFirstName = slugify(firstName);
  const slugLastName = slugify(lastName);
  let slug = `${slugFirstName}-${slugLastName}`;

  let counter = 1;
  while (await userSlugExists(slug)) {
    slug = `${slugFirstName}-${slugLastName}-${counter}`;
    counter++;
  }
  return slug;
}

export function generateRecipeSlug(title, author = null) {
  const slugify = (str) =>
    str
      .normalize("NFD") // décompose les caractères accentués (é => e + ́)
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // remplace les groupes de caractères non alphanumériques par des tirets
      .replace(/^-+|-+$/g, ""); // supprime les tirets en début/fin

  const slugTitle = slugify(title);
  let slug = slugTitle;

  if (author) {
    const slugAuthor = slugify(author);
    slug = `${slugTitle}-${slugAuthor}`;
  }

  return slug;
}
