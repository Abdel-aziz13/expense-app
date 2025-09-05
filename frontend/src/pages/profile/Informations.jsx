import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

function Informations() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // Fetch du profil
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.user.photo);

      return res.data.user;
    },
    retry: 1,
  });

  // États locaux
  const [profileImage, setProfileImage] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [profession, setProfession] = useState("");

  // Remplir les champs avec le profil
  useEffect(() => {
    if (profile) {
      setNom(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setAbout(profile.about || "");
      setProfession(profile.profession || "");
      setProfileImage(
        profile.photo ? `http://localhost:8000/storage/${profile.photo}` : null
      );
    }
  }, [profile]);

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", nom);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("about", about);
      formData.append("profession", profession);

      if (profileImage instanceof File) {
        formData.append("photo", profileImage);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      alert("Profil mis à jour avec succès !");
    },
    onError: (err) => {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  if (isLoading) return <p>Chargement du profil...</p>;
  if (isError) return <p>Erreur lors du chargement du profil.</p>;

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Informations personnelles
      </h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-gray-700">Nom & Prénom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Photo de profil */}
          <div>
            <label className="block text-gray-700 mb-1">Photo de profil</label>
            <div className="flex items-center gap-4">
              {/* <img
                src={
                  profileImage instanceof File
                    ? URL.createObjectURL(profileImage)
                    : profileImage ||
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full border"
              /> */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-600
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-gray-700">Adresse</label>
          <textarea
            rows="3"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        {/* Profession */}
        <div>
          <label className="block text-gray-700">Profession</label>
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Enregistrer les modifications
        </button>
      </form>
    </section>
  );
}

export default Informations;
