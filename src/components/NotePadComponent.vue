<script setup>
import { Pencil, Pin, PinOff, PlusCircle, ContentSave, Close } from "mdue";
import { ref, computed, watch } from "vue";
import { useNotesStore } from "../store/note";
import { onClickOutside } from "@vueuse/core";
import LoadingComponent from "./LoadingComponent.vue";

//initializations
const emit = defineEmits(["save", "close"]);

let noteData = ref({
  title: "",
  content: "",
  pinned: false,
});

//this is the id counter
let objectId = 1;
let todoList = ref([
  {
    id: objectId,
    completed: ref(false),
    title: ref(""),
  },
]);
const notePadWrap = ref(null);

//initialize store
const notesStore = useNotesStore();

//computed
let selectedNote = computed(() => notesStore.selectedNote);
let notepadType = computed(() => notesStore.notepadType);
let completedItems = computed(() =>
  todoList.value.filter((e) => e.completed == true)
);
let activeItems = computed(() =>
  todoList.value.filter((e) => e.completed == false)
);
let isSavingNote = computed(() => notesStore.isSavingNote);

watch(
  () => selectedNote.value,
  (newValue) => {
    if (newValue.note_type === "todo") {
      let parsedData = JSON.parse(newValue.content);
      todoList.value = parsedData;
      objectId = parsedData[parsedData.length - 1].id + 1;
    }
    noteData.value = newValue;
  }
);

//methods
const closeNotepad = () => {
  objectId = 1;
  todoList.value = [
    {
      id: objectId,
      completed: ref(false),
      title: ref(""),
    },
  ];
  notesStore.closeNotepad();
};
const addItemToTodoList = () => {
  objectId++;
  todoList.value.push({
    id: objectId,
    completed: ref(false),
    title: ref(""),
  });
};

const pinNote = () => {
  if (selectedNote.value.id) {
    notesStore.togglePinNote(selectedNote.value.id).then(() => {
      closeNotepad();
    });
  } else {
    noteData.value.pinned = !noteData.value.pinned;
  }
};

const saveNote = () => {
  if (notepadType.value === "todo") {
    noteData.value.note_type = "todo";
    noteData.value.content = JSON.stringify(todoList.value);
  }

  if (!noteData.value.title && !noteData.value.content) {
    return;
  }

  if (noteData.value.id) {
    //update note
    notesStore
      .updateNote(noteData.value)
      .then(() => {
        closeNotepad();
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    notesStore
      .saveNote(noteData.value)
      .then(() => {
        closeNotepad();
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const removeTodoItem = (itemID) => {
  let getIndex = todoList.value.findIndex((e) => e.id === itemID);
  todoList.value.splice(getIndex, 1);
};

onClickOutside(notePadWrap, () => {
  closeNotepad();
});
</script>

<template>
  <div
    class="
      fixed
      w-screen
      h-screen
      bg-gray-500 bg-opacity-70
      top-0
      left-0
      flex
      justify-center
      items-center
      z-50
    "
  >
    <div class="h-5/6 w-6/12 bg-white rounded-lg relative" ref="notePadWrap">
      <form class="flex flex-col h-full relative" @submit.prevent="saveNote()">
        <div class="w-full p-6">
          <div class="rounded bg-gray-50 h-12 flex items-center px-4">
            <button
              @click.prevent="pinNote"
              class="rounded border border-green-600 h-6 w-6"
            >
              <Pin
                class="text-green-600 h-4 w-4 mx-auto"
                v-if="!noteData.pinned"
              />
              <PinOff
                class="text-green-600 h-4 w-4 mx-auto"
                v-if="noteData.pinned"
              />
            </button>

            <button
              @click.prevent="closeNotepad"
              class="rounded bg-red-500 h-6 w-6 ml-auto"
            >
              <Close class="text-white h-4 w-4 mx-auto" />
            </button>
          </div>
        </div>

        <div class="overflow-y-auto p-6 flex flex-col flex-1">
          <div class="bg-red-600">
            <input
              type="text"
              v-model.trim="noteData.title"
              class="w-full text-2xl font-bold border-0 outline-0"
              placeholder="Title"
            />
          </div>

          <div class="flex-1 mt-5">
            <div class="w-full h-full" v-if="notepadType === 'note'">
              <textarea
                v-model.trim="noteData.content"
                placeholder="Take a note"
                class="w-full h-full border-0 resize-none outline-0"
              />
            </div>

            <div v-if="notepadType === 'todo'" class="h-full w-full">
              <div
                class="flex items-center mb-4"
                v-for="todoItem in activeItems"
                :key="todoItem.id"
                :id="`todoItem-${todoItem.id}`"
              >
                <input
                  type="checkbox"
                  v-model="todoItem.completed"
                  class="form-checkbox mr-5 h-5 w-5 checked:bg-green-600"
                />
                <input
                  type="text"
                  class="outline-0 border-b w-full h-8"
                  v-model.trim="todoItem.title"
                />
                <button
                  class="ml-6"
                  @click.prevent="removeTodoItem(todoItem.id)"
                >
                  <Close class="h-6 w-6" />
                </button>
              </div>

              <div>
                <button @click.prevent="addItemToTodoList">
                  <PlusCircle class="inline-block h-6 w-6" /> Add Item
                </button>
              </div>

              <div class="mt-5">
                <p v-if="completedItems.length > 0">Completed Items</p>

                <div
                  class="flex items-center mb-4"
                  v-for="todoItem in completedItems"
                  :key="todoItem.id"
                  :id="`todoItem-${todoItem.id}`"
                >
                  <input
                    type="checkbox"
                    v-model="todoItem.completed"
                    class="form-checkbox mr-5 h-5 w-5"
                  />
                  <p class="outline-0 w-full line-through text-xl">
                    {{ todoItem.title }}
                  </p>
                  <button
                    class="ml-6"
                    @click.prevent="removeTodoItem(todoItem.id)"
                  >
                    <Close class="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ml-auto mt-6 mr-6 mb-6">
          <div v-if="isSavingNote" >
          <LoadingComponent/>
          </div>
          <button
            class="
              rounded-full
              w-14
              h-14
              text-white
              flex flex-col
              items-center
              justify-center
            "
            :class="
              !noteData.title && !noteData.content
                ? 'bg-gray-600 opacity-20'
                : 'bg-green-600 '
            "
            :disabled="!noteData.title && !noteData.content"
            v-else
          >
            <ContentSave class="h-6 w-6 mb-0" />
            <span class="text-xs">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>