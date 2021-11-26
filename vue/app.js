const app = Vue.createApp({
	template: '',
	data() {
		return {
			files: [],
			file: '',
			openedFile: '',
			content: '',
			table:
				'<table class="fileproperties">\
            <tr>\
                <th>Name</th>\
                <th>Size</th>\
                <th>Address</th>\
                <th>Permissions</th>\
            </tr>'
		};
	},
	methods: {
		getFiles() {
			axios
				.get('http://localhost:8000/files')
				.then(res => (this.files = res.data))
				.catch(e => console.log(e));
		},
		openFile(file) {
			this.openedFile = file;
			axios
				.post(`/files-list?folder=${file}`, true)
				.then(res => {
					this.content = this.table + res.data + '</table>';
				})
				.catch(err => console.log(err));
		},
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
		},
		submitFile() {
			let formData = new FormData();
			formData.append('file', this.file);
			axios
				.post(`/?type=${this.openedFile}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(function (response) {
					if(response.data){
                        alert('File uploaded successfully')
                      } else{
                        alert('There was an error')
                      }
				})
				.catch(function () {
					alert('FAILURE!!');
				});
		}
	},
	created() {
		this.getFiles();
	}
});

app.mount('#app');
