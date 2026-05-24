export const BASE_URL = "https://nightclub-api-dhqe.onrender.com";

export const imageUrl = (path) => `${BASE_URL}${path}`;

export async function getEvents(options = {}) {
  const res = await fetch(`${BASE_URL}/events`, options);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getEvent(slug) {
  const res = await fetch(`${BASE_URL}/events/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export async function getTestimonials() {
  const res = await fetch(`${BASE_URL}/testimonials`);
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
}

export async function getGallery() {
  const res = await fetch(`${BASE_URL}/gallery`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

export async function getComments() {
  const res = await fetch(`${BASE_URL}/comments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function getReservations(eventId) {
  const res = await fetch(`${BASE_URL}/reservations?eventId=${eventId}`);
  if (!res.ok) throw new Error("Failed to fetch reservations");
  return res.json();
}

export async function postContactMessage(data) {
  return fetch(`${BASE_URL}/contact_messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function postNewsletter(email) {
  return fetch(`${BASE_URL}/newsletters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function postReservation(data) {
  return fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteReservation(id) {
  return fetch(`${BASE_URL}/reservations/${id}`, { method: "DELETE" });
}
