// recaptcha
// Vue.component( 'vue-recaptcha', VueRecaptcha )

// load more button
Vue.component( 'mx_ddp_load_more_button', {

	props: {
		ddpcount: {
			type: Number,
			required: true
		},
		ddpperpage: {
			type: Number,
			required: true
		},
		ddpcurrentpage: {
			type: Number,
			required: true
		},
		pageloading: {
			type: Boolean,
			required: true
		},
		load_img: {
			type: String,
			required: true
		},
		load_more_progress: {
			type: Boolean,
			required: true
		}
	},

	template: ` 
		<div v-if="!pageloading && ( ddpcurrentpage * ddpperpage ) < ddpcount">
			<p class="mx-cmt-wrap-link">
				<button
					v-if="!load_more_progress"
					type="button"
					class="btn cmt-button cmt-green cmt-shadow"
					@click.prevent="loadMore" 
				>Load More</button>
			</p>
			<div v-if="load_more_progress" class="mx-loading-ddp">
				<img :src="load_img" alt="" class="" />						
			</div>
		</div>
	`,
	data() {
		return {



		}
	},
	methods: {
		loadMore() {

			this.$emit( 'load_more', true )

		}
	}

} )

// search
Vue.component( 'mx_ddp_search', {

	props: {
		pageloading: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="mx-ddp-search">

			<form
				v-if="!pageloading"
				class="mx-input-group"
			>
	            <div class="mx-input-group-prepend">
	              <button
	              	class="input-group-text bg-white border-0"
	              	type='submit'
	              	@click.prevent="mxSearch"
	              	>
	                <i class='fa fa-search'></i>
	              </button>
	            </div>
	            <input
	            	type="text"
	            	class="form-control border-0"
	            	placeholder="Search title, or keywords…"
	              	v-model="search"
					@input="mxSearch"
	            >
	         </form>

		</div>
	`,
	data() {
		return {
			search: null,
			timeout: null
		}
	},
	methods: {
		mxSearch() {

			var _this = this

			clearTimeout( _this.timeout )

			let search_query = this.search

			if( search_query ) {

				if( search_query.length >= 3 ) {

					_this.timeout = setTimeout( function() {

						_this.$emit( 'mx-search-request', search_query )

					}, 1000 )

				}

			}

			if( !search_query ) {

				if( search_query !== null ) {

					_this.timeout = setTimeout( function() {

						_this.$emit( 'mx-search-request', search_query )

					}, 1000 )

				}

			}
			
		}
	}
} )

// item
Vue.component( 'mx_ddp_item', {

	props: {
		ddpitemdata: {
			type: Object,
			required: true
		},
		post_type: {
			type: String,
			required: true
		},
		default_photo: {
			type: String,
			required: true
		}
	},

	template: `
	<div :class="get_classes_wrap">

		<div class="mx-default">
			<div class="mx-ddp-image-wrap">
	        	<img :src="the_thumbnail" alt="...">
	        </div>

	        <div class="mx-ddp-content">
		        <a :href="the_permalink" class="mx-ddp-title">{{ the_title }}</a>
		        <div v-html="post_excerpt"></div>
	        </div>
	    </div>

    </div>
	`,
	data() {
		return {			

		}
	},
	computed: {

		get_classes_wrap() {

			let classes = 'mx-container'

			return classes

		},
		the_id() {
			return this.ddpitemdata.ID
		},
		the_title() {
			return this.ddpitemdata.post_title
		},
		the_permalink() {

			return this.ddpitemdata.the_permalink

		},
		the_thumbnail() {

			let thumbnail = this.default_photo

			if( this.ddpitemdata.the_thumbnail ) {

				thumbnail = this.ddpitemdata.the_thumbnail

			}

			return thumbnail

		},
		post_excerpt() {

			return this.ddpitemdata.post_excerpt

		},
		the_content() {

			// line break
			var content = this.ddpitemdata.post_content

			content = content.replace(/\r?\n/g, '<br>')

			return content
		},
		the_answer() {

			var answer = this.ddpitemdata.answer

			answer = answer.replace(/\r?\n/g, '<br>')
			
			return answer
		},
		the_user_name() {
			return this.ddpitemdata.user_name
		},
		the_date() {
			let date = new Date( this.ddpitemdata.post_date )

			let day = date.getDate()

			let month = date.getMonth() + 1

			let year = date.getFullYear()

			return day + '/' + month + '/' + year
		}

	}
	
} )

// list of items
Vue.component( 'mx_ddp_list_items', {

	props: {
		getddpitems: {
			type: Array,
			required: true
		},
		parsejsonerror: {
			type: Boolean,
			required: true
		},
		pageloading: {
			type: Boolean,
			required: true
		},
		load_img: {
			type: String,
			required: true
		},
		no_items: {
			type: String,
			required: true
		},
		post_type: {
			type: String,
			required: true
		},
		default_photo: {
			type: String,
			required: true
		}
	},
	template: `
		<div>

			<div v-if="parsejsonerror">
				${mx_ddpdata_obj_front.texts.error_getting}
			</div>
			<div v-else>

				<div v-if="!getddpitems.length">				

					<div v-if="pageloading" class="mx-loading-ddp">
						<img :src="load_img" alt="" class="" />
					</div>
					<div v-else class="mx-no-items-found">
						{{ no_items }}
					</div>

				</div>
				<div 
					:class="get_classes_wrap"
					v-else
				>

					<mx_ddp_item
						v-for="item in get_items"
						:key="item.ID"				
						:ddpitemdata="item"
						:post_type="post_type"
						:default_photo="default_photo"
					></mx_ddp_item>

				</div>

			</div>				
			
		</div>
	`,
	data() {
		return {
		}
	},
	computed: {

		get_classes_wrap() {

			let classes = 'mx-news-list'

			return classes

		},
		get_items() {
			return this.getddpitems
		}

	}

} )

// ddp pagination
Vue.component( 'mx_ddp_pagination',	{

	props: {
		ddpcount: {
			type: Number,
			required: true
		},
		ddpperpage: {
			type: Number,
			required: true
		},
		ddpcurrentpage: {
			type: Number,
			required: true
		},
		pageloading: {
			type: Boolean,
			required: true
		}
	},

	template: `
		<div v-if="!pageloading && ( ddpcount - ddpperpage ) > 0">

			<ul class="mx-ddp-pagination">		

				<li
					v-for="page in coutPages"
					:key="page"
					:class="[page === ddpcurrentpage ? 'mx-current-page' : '']"
				><a 
					:href="'#page-' + page"
					@click.prevent="getPage(page)"
					>{{ page }}</a></li>

			</ul>

		</div>
	`,
	methods: {
		getPage( page ) {

			this.$emit( 'get-ddp-page', page )

			let el = document.getElementById( 'mx_ddp_container' )

			const y = el.getBoundingClientRect().top + window.scrollY;

			window.scroll( {
				top: y,
				behavior: 'smooth'
			} );

		}
	},
	computed: {
		coutPages() {

			let difference = this.ddpcount / this.ddpperpage

			if( Number.isInteger( difference ) ) {
				return difference
			}

			return parseInt( difference ) + 1
		}
	}
} )

if( document.getElementById( 'mx_ddp_container' ) ) {

	var app = new Vue( {
		el: '#mx_ddp_container',
		data: {
			noItemsMessages: {
				noItemsInDB: mx_ddpdata_obj_front.texts.no_questions,
				noSearchItems: mx_ddpdata_obj_front.texts.nothing_found
			},
			noItemsDisplay: '',
			ddpCurrentPage: 1,
			ddpPerPage: 3,
			ddpCount: 0,
			ddpItems: [],
			parseJSONerror: false,
			pageLoading: true,
			loadImg: mx_ddpdata_obj_front.loading_img,
			query: '',
			tax_query: [],
			load_more_progress: false,
			post_type: 'post',
			ddpPaginagion: 'numbers',
			default_photo: mx_ddpdata_obj_front.no_phot,
			search_bar: 'on'
		},
		methods: {
			loadMoreItems() {

				this.load_more_progress = true

				let query = this.query

				let _this = this

				let data = {

					action: 'mx_ddp_load_more_items',
					nonce: mx_ddpdata_obj_front.nonce,
					current_page: _this.ddpCurrentPage + 1,
					ddp_per_page: _this.ddpPerPage,
					query: query,
					tax_query: _this.tax_query,
					post_type: _this.post_type
				};			

				jQuery.post( mx_ddpdata_obj_front.ajax_url, data, function( response ) {

					if( _this.isJSON( response ) ) {

						_this.get_count_ddp_items( query )

						let new_items = JSON.parse( response )

						_this.ddpItems = _this.ddpItems.concat( new_items );

						_this.ddpCurrentPage += 1

						_this.pageLoading = false

						_this.load_more_progress = false				

					} else {

						this.parseJSONerror = true

					}					

				} );				

			},
			searchQuestion( query ) {

				this.noItemsDisplay = this.noItemsMessages.noSearchItems

				// clear data ...
					this.ddpItems = []

					this.pageLoading = true

					let page = 1

					this.ddpCurrentPage = page

					this.ddpCurrentPage = page

					// history.pushState( { ddpPage: page },"",'#page-' + page )
				// ... clear data

				// set query
				let _query = ''

				if( query !== null ) {

					_query = query

				}

				this.query = _query

				var _this = this

				var data = {

					action: 'mx_search_ddp_items',
					nonce: mx_ddpdata_obj_front.nonce,
					current_page: _this.ddpCurrentPage,
					ddp_per_page: _this.ddpPerPage,
					query: query,
					tax_query: _this.tax_query,
					post_type: _this.post_type
				};			

				jQuery.post( mx_ddpdata_obj_front.ajax_url, data, function( response ) {

					if( _this.isJSON( response ) ) {

						_this.get_count_ddp_items( query )

						_this.ddpItems = JSON.parse( response );

						_this.pageLoading = false						

					} else {

						this.parseJSONerror = true

					}

				} );

			},
			changeddpPage( page ) {

				this.ddpCurrentPage = page

				// history.pushState( { ddpPage: page },"",'#page-' + page )

				this.get_ddp_items()
			},
			get_current_page() {

				let curretn_page = window.location.href

				if( curretn_page.indexOf( '#page-' ) >= 0 ) {

					let matches = curretn_page.match( /#page-(\d+)/ )

					let get_page = parseInt( matches[1] );

					if( Number.isInteger( get_page ) ) {

						this.ddpCurrentPage = get_page

					}		

				} else {

					// history.pushState( { ddpPage:'1' },"",'#page-1' )

				}				

			},
			get_count_ddp_items( query ) {

				let _query = ''

				if( query !== null ) _query = query

				var _this = this

				var data = {

					action: 'mx_get_count_ddp_items',
					nonce: mx_ddpdata_obj_front.nonce,
					query: _query,
					tax_query: _this.tax_query,
					post_type: _this.post_type
				};				

				jQuery.post( mx_ddpdata_obj_front.ajax_url, data, function( response ) {

					let count = parseInt( response )

					if( Number.isInteger( count ) )	{

						_this.ddpCount = count

					}

				} );

			},
			get_ddp_items() {

				this.noItemsDisplay = this.noItemsMessages.noItemsInDB

				var _this = this

				var data = {

					action: 'mx_get_ddp_items',
					nonce: mx_ddpdata_obj_front.nonce,
					current_page: _this.ddpCurrentPage,
					ddp_per_page: _this.ddpPerPage,
					query: _this.query,
					tax_query: _this.tax_query,
					post_type: _this.post_type
				};			

				jQuery.post( mx_ddpdata_obj_front.ajax_url, data, function( response ) {

					if( _this.isJSON( response ) ) {

						var result = JSON.parse( response );

						_this.ddpItems = result;

						_this.pageLoading = false

					} else {

						this.parseJSONerror = true

					}

				} );

			},
			isJSON( str ) {
				try {
			        JSON.parse(str);
			    } catch (e) {
			        return false;
			    }
			    return true;
			},
			prepareTaxQuery() {

				if( mx_ddp_tax_query !== 'undefined' ) {

					this.tax_query = mx_ddp_tax_query

				} else {

					this.tax_query = []

				}
				
			},
			preparePostType() {

				if( mx_ddp_post_type !== 'undefined' ) {

					this.post_type = mx_ddp_post_type

				} else {

					this.post_type = 'post'

				}

			},
			preparePostsPerPage() {

				if( mx_ddp_posts_per_page !== 'undefined' ) {

					this.ddpPerPage = mx_ddp_posts_per_page

				} else {

					this.ddpPerPage = 10

				}

			},
			preparePagination() {

				if( mx_ddp_pagination !== 'undefined' ) {

					this.ddpPaginagion = mx_ddp_pagination

				} else {

					this.ddpPaginagion = 'numbers'

				}

			},
			prepareDefaultImage() {

				if( mx_ddp_default_image_url !== 'undefined' ) {

					if( mx_ddp_default_image_url !== 'none' ) {

						this.default_photo = mx_ddp_default_image_url

					}					

				} else {

					this.default_photo = mx_ddpdata_obj_front.no_phot

				}

			},
			prepareSearchBar() {

				if( mx_ddp_search_bar !== 'undefined' ) {

					if( mx_ddp_search_bar === 'off' ) {

						this.search_bar = mx_ddp_search_bar

					}					

				} else {

					this.search_bar = 'on'

				}

			}		
			
		},
		beforeMount() {

			// prepate tax query
			this.prepareTaxQuery()

			// prepare post type
			this.preparePostType()

			// prepare posts per page
			this.preparePostsPerPage()

			// prepare pagination
			this.preparePagination()

			// prepare default image
			this.prepareDefaultImage()

			// prepare search bar
			this.prepareSearchBar()

			// get current page
			this.get_current_page()

			// get count of ddp items
			this.get_count_ddp_items( null )

			// get ddp items
			this.get_ddp_items()

		}
	} )

}
