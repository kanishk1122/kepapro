import  { useState } from "react";
import axios from "../utils/Axios";
import Cookies from "js-cookie";

const Login = () => {
  const [formData, setFormData] = useState({
    links: [""],
    languages: [""],
    qualities: [""],
    season: "",
    ep: [""],
    description: "",
    genres: [],
    thumnail: "",
    animename: "",
    rating: "",
    download: [""], // Change this line
    seasonname: "",
  });

  const token = Cookies.get("token");

  const jwtDecode = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/addlink", formData, {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data) {
        console.log("Video details added successfully.");
        // Reset form data after successful submission
        setFormData({
          links: [""],
          languages: [""],
          qualities: [""],
          season: "",
          ep: [""],
          description: "",
          genres: [],
          thumnail: "",
          animename: "",
          rating: "",
          download: [""],
          seasonname: "",
        });
      } else {
        console.error("Failed to add video details.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddQuality = () => {
    setFormData({
      ...formData,
      links: [...formData.links, ""],
      languages: [...formData.languages, ""],
      qualities: [...formData.qualities, ""],
      ep: [...formData.ep, ""],
      download: [...formData.download, ""],
    });
  };

  const handleDeleteQuality = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    const updatedDownload = formData.download.filter((_, i) => i !== index);
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    const updatedQualities = formData.qualities.filter((_, i) => i !== index);
    const updatedEp = formData.ep.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      links: updatedLinks,
      languages: updatedLanguages,
      qualities: updatedQualities,
      ep: updatedEp,
      download: updatedDownload,
    });
  };
  const handleLinkChange = (index, e) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index] = e.target.value;
    setFormData({ ...formData, links: updatedLinks });
  };

  const handledownloadchange = (index, e) => {
    const updatedDownload = [...formData.download];
    updatedDownload[index] = e.target.value;
    setFormData({ ...formData, download: updatedDownload });
  };

  const handleLanguageChange = (index, e) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = e.target.value;
    setFormData({ ...formData, languages: updatedLanguages });
  };

  const handleQualityChange = (index, e) => {
    const updatedQualities = [...formData.qualities];
    updatedQualities[index] = e.target.value;
    setFormData({ ...formData, qualities: updatedQualities });
  };

  const handleEpChange = (index, e) => {
    const updatedEp = [...formData.ep];
    updatedEp[index] = e.target.value;
    setFormData({ ...formData, ep: updatedEp });
  };

  return (
    <div>
      {/* import.meta.env.VITE_ADMIN_PASS */}

      {
      Cookies.get("token") && jwtDecode(token).Admin === import.meta.env.VITE_UPDATE_PASS  &&
       (
        <div className="bg-neutral-900 text-white">
          <form
            className="flex justify-center w-full flex-col gap-8 items-center"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-semibold">Video Detail</h1>
            <button
              type="submit"
              className="bg-blue-900 px-2 py-1 rounded"
            >
              Add Link
            </button>
            <div className="flex flex-col gap-3 ">
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 items-center  flex-wrap justify-center  ">
                 <iframe
              className="w-full h-full rounded-lg z-10"
              src={formData.links[index]}
              allowFullScreen
            ></iframe>
                <input
                  type="text"
                  value={formData.links[index]}
                  onChange={(e) => handleLinkChange(index, e)}
                  placeholder="Enter Video Link"
                  className="bg-transparent"
                />
                <input
                  type="text"
                  value={formData.download[index]}
                  onChange={(e) => handledownloadchange(index, e)}
                  placeholder="Enter download Link"
                  className="bg-transparent"
                />
                <div>
                  <label>Language:</label>
                  <select
                    value={formData.languages[index]}
                    onChange={(e) => handleLanguageChange(index, e)}
                    className="bg-black"
                  >
                    <option value="null">select your language</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label>Quality:</label>
                  <select
                    value={formData.qualities[index]}
                    onChange={(e) => handleQualityChange(index, e)}
                    className="bg-black"
                  >
                    <option value="null">select your quality</option>
                    <option value="1080">1080p</option>
                    <option value="720">720p</option>
                    <option value="480">480p</option>
                  </select>
                </div>
                <input
                  type="number"
                  className="bg-transparent  h-5 focus:bg-transparent  placeholder:text-zinc-400"
                  placeholder="Enter Episode Number"
                  value={formData.ep[index]}
                  onChange={(e) => handleEpChange(index, e)}
                  name="ep"
                />
                <button type="button" onClick={() => handleDeleteQuality(index)} className="bg-red-600 px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
            </div>
            <button type="button" onClick={handleAddQuality} className="bg-green-600 px-2 py-1 rounded">
              Add quantity
            </button>
            {/* Other input fields */}
            <input
              type="text"
              className="bg-transparent w-[70vw] h-5 focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter Thumbnail Link"
              value={formData.thumnail}
              onChange={(e) => setFormData({ ...formData, thumnail: e.target.value })}
              name="thumnail"
            />
            <input
              type="number"
              className="bg-transparent w-[70vw] h-5 focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter Season Number"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              name="season"
            />
            <input
              type="text"
              className="bg-transparent w-[70vw] h-5 focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter anime name"
              value={formData.animename}
              onChange={(e) => setFormData({ ...formData, animename: e.target.value })}
              name="animename"
            />
            <input
              type="text"
              className="bg-transparent w-[70vw] h-5 focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter season name"
              value={formData.seasonname}
              onChange={(e) => setFormData({ ...formData, seasonname: e.target.value })}
              name="seasonname"
            />
            <input
              type="number"
              className="bg-transparent w-[70vw] h-5 focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter anime rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              name="rating"
            />
            <textarea
              className="bg-transparent w-[70vw] h-[100px] focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter Genres (separated by commas)"
              value={formData.genres.join(",")}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value.split(",") })}
              name="genres"
            />
            <textarea
              className="bg-transparent w-[70vw] h-[100px] focus:bg-transparent  placeholder:text-zinc-400"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              name="description"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
