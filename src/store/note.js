import { defineStore } from "pinia";
import api from "../services/api";

export const useNotesStore = defineStore("notes", {
  state: () => ({
    isNotepadOpen: false,
    isSavingNote: false,
    isLoadingNotes: true,
    notes: [],
    notepadType: "note",
    selectedNote: {},
  }),

  getters: {
    pinnedNotes: (state) => state.notes.filter((note) => note.pinned == true),
    allOtherNotes: (state) =>
      state.notes.filter((note) => note.pinned == false),
  },

  actions: {
    addNote(data) {
      this.notes.unshift(data);
    },

    closeNotepad() {
      this.selectedNote = {};
      this.isNotepadOpen = false;
    },

    async getAllNotes() {
      api
        .get("/notes")
        .then(({ data }) => {
          this.notes = data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    openNotepad(type = "note") {
      this.isNotepadOpen = true;
      this.notepadType = type;
    },

    async saveNote(requestData) {
       this.isSavingNote = true;
      let response = await api.post("/notes", requestData);
      if (response.data) {
        this.addNote(response.data.note);
        this.isSavingNote = false;
        this.isNotepadOpen = false;
        this.selectedNote = {};
      }
      return response;
    },

    async updateNote(requestData) {
       this.isSavingNote = true;
      let data = { ...requestData };
      //remove non allowed data
      delete data.user_id;
      delete data.id;
      delete data.created_at;
      delete data.updated_at;

      let noteIndex = this.notes.findIndex((e) => e.id == requestData.id);
      let response = await api.put(`/notes/${requestData.id}`, data);
      if (response.data) {
        this.isSavingNote = false;
        this.isNotepadOpen = false;
        this.selectedNote = {};
        this.notes.splice(noteIndex, 1, response.data.note);
      }
      return response;
    },

    async togglePinNote(noteID) {
      let noteIndex = this.notes.findIndex((e) => e.id == noteID);
      let data = {};
      if (this.notes[noteIndex].pinned == true) {
        data = { id: noteID, pinned: false };
      } else {
        data = { id: noteID, pinned: true };
      }
      this.updateNote(data);
    },

    async deleteNote(noteID) {
      let noteIndex = this.notes.findIndex((e) => e.id == noteID);
      let response = await api.delete(`/notes/${noteID}`);
      if (response.data) {
        this.notes.splice(noteIndex, 1);
      }
      return response;
    },

    setSelectedNote(note) {
      this.selectedNote = note;
    },
  },
});
