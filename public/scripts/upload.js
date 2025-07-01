let dropzone, fileInput, previewContainer;
let supabaseClient;

if (typeof document !== 'undefined') {
  dropzone = document.getElementById('dropzone');
  fileInput = document.getElementById('photos');
  previewContainer = document.getElementById('image-preview');
}

try {
  const supabaseUrl =
    (typeof process !== 'undefined' && process.env.SUPABASE_URL) ||
    (typeof window !== 'undefined' && window.SUPABASE_URL);
  const supabaseAnonKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined.');
  }

  if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error('Supabase initialization failed:', err);
  if (dropzone) {
    dropzone.innerHTML = '<p style="color:red;">Image uploads are currently unavailable.</p>';
  }
}
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_DIMENSION = 4000;

export async function isValidFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const isBasicValid = validTypes.includes(file.type) &&
    file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
  if (!isBasicValid) return false;

  if (typeof Image === 'undefined') {
    return true;
  }

  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        if (typeof alert !== 'undefined') {
          alert(`Image dimensions exceed ${MAX_DIMENSION}x${MAX_DIMENSION}px`);
        }
        resolve(false);
      } else {
        resolve(true);
      }
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
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

async function handleFiles(selectedFiles) {
  const validFiles = [];
  for (const file of Array.from(selectedFiles)) {
    const valid = await isValidFile(file);
    if (!valid) {
      if (typeof alert !== 'undefined') {
        alert(`Invalid file: ${file.name}`);
      }
      continue;
    }
    validFiles.push(file);
  }

  if (validFiles.length > MAX_FILES) {
    alert(`You can only upload up to ${MAX_FILES} images.`);
    return;
  }

  const dataTransfer = new DataTransfer();
  validFiles.forEach(f => dataTransfer.items.add(f));
  fileInput.files = dataTransfer.files;

  showImagePreviews(validFiles);
}

if (dropzone && fileInput) {
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = '#0077ff'; });
  dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '#ccc');
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.style.borderColor = '#ccc';
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

export async function uploadImagesToSupabasePrivate(files) {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return [];
  }
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

// Make available to other scripts when not using modules
if (typeof window !== 'undefined') {
  window.uploadImagesToSupabasePrivate = uploadImagesToSupabasePrivate;
}

// Final form submission handler could be included here or inline in index.html
