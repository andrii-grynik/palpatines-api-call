import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    swapi: {
      type: "app",
      app: "swapi",
    },
  },
  async run({ steps, $ }) {
    return await axios($, {
      url: `https://swapi.dev/api/films/1/`,
    });
  },
});
