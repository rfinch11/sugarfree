const supabaseUrl =
  (typeof process !== 'undefined' && process.env.SUPABASE_URL) ||
  window.SUPABASE_URL;
const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) ||
  window.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined.');
}

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('photos');
const previewContainer = document.getElementById('image-preview');
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;

function isValidFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type) && file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
}

function showImagePreviews(files) {
  previewContainer.innerHTML = '';
  for (let file of files) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.alt = file.name;
    previewContainer.appendChild(img);
  }
}

function handleFiles(selectedFiles) {
  const validFiles = Array.from(selectedFiles).filter(file => {
    if (!isValidFile(file)) {
      alert(`Invalid file: ${file.name}`);
      return false;
    }
    return true;
  });

  if (validFiles.length > MAX_FILES) {
    alert(`You can only upload up to ${MAX_FILES} images.`);
    return;
  }

  const dataTransfer = new DataTransfer();
  validFiles.forEach(f => dataTransfer.items.add(f));
  fileInput.files = dataTransfer.files;

  showImagePreviews(validFiles);
}

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = '#0077ff'; });
dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '#ccc');
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.style.borderColor = '#ccc';
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

async function uploadImagesToSupabasePrivate(files) {
  const uploaded = [];
  for (let file of files) {
    const filePath = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabaseClient.storage.from('photos').upload(filePath, file);
    if (uploadError) continue;
    const { data: signedData } = await supabaseClient.storage.from('photos').createSignedUrl(filePath, 604800);
    uploaded.push({ url: signedData.signedUrl, fallback_url: filePath });
  }
  return uploaded;
}

// Final form submission handler could be included here or inline in index.html
