<script setup>
import { Pin,Note,FormatListBulletedSquare, Pencil, Image} from "mdue"
import NotePadComponent from "../components/NotePadComponent.vue";
import { ref, computed } from "vue";
import { useNotesStore } from "../store/note";
import NoteComponent from "../components/NoteComponent.vue";

//initializations

//initialize store
const notesStore = useNotesStore();

let noteType = ref('note');
//get all notes
notesStore.getAllNotes();
let allOtherNotes = computed(() => notesStore.allOtherNotes);
let pinnedNotes = computed(() => notesStore.pinnedNotes);
let isLoadingNotes = computed(() => notesStore.isLoadingNotes);
let isNotepadOpen = computed(() => notesStore.isNotepadOpen);

//methods
const openNotepad = (type)=>{
  notesStore.openNotepad(type);
}

</script>

<template>
  <div class="relative">
    <NotePadComponent v-show="isNotepadOpen" />

    <div class="container flex justify-center mt-10">
      <div
        id="input-area"
        class="
          bg-gray-100
          border
          w-10/12
          lg:w-5/12
          h-14
          px-4
          rounded-full
          flex
          justify-center
          items-center
        "
      >
        <div class="flex-1 cursor-horizontal-text" @click="openNotepad('note')">
          <p class="text-gray-700">Take a note</p>
        </div>

        <div class="flex justify-center items-center">
          <button @click="openNotepad('todo')"><FormatListBulletedSquare class="h-5 w-5 mr-3 " /></button>
          <button>
            <Pencil class="h-5 w-5" @click="openNotepad('note')" />
          </button>
        </div>
      </div>
    </div>

    <div class="container mt-6 mb-16">
      <div v-if="pinnedNotes.length > 0">
        <div class="mb-3 font-semibold text-green-600 flex items-center"><Pin class="w-5 h-5 inline-block mr-2"/>Pinned Notes</div>
        <div class="grid grid-col-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <template v-for="note in pinnedNotes" :key="note.id">
            <NoteComponent
              :note="note"
              class="border p-4 mb-5 relative max-h-80 text-clip"
            />
          </template>
        </div>
      </div>

      <div class="mt-12">
        <div class="mb-3 font-semibold text-green-600 flex items-center" v-if="allOtherNotes.length >0"> <Note class="w-5 h-5 inline-block mr-2"/> Notes</div>
        <div class="masonry sm:masonry-sm lg:masonry-lg xl:masonry-xl">
          <template v-for="note in allOtherNotes" :key="note.id">
            <NoteComponent
              :note="note" 
              class="border p-4 break-inside mb-5 relative max-h-80 text-clip note-item"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>