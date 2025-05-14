const mongoose = require('mongoose');

const BlessingSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, 'Blessing item text is required.']
    },
    description: {
        type: String,
        default: '' 
    }
}, { _id: false });

const GreentextPostSchema = new mongoose.Schema({
    volume_number: {
        type: Number,
        required: [true, 'Volume number is required.'],
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true
    },
    full_title_generated: {
        type: String
    },
    story_content_raw: {
        type: String,
        required: [true, 'Story content is required.']
    },
    blessing_intro: {
        type: String,
        default: 'life is x, y and z, but at least I have:',
        trim: true
    },
    blessing_list: [BlessingSchema],
    edition_footer: {
        type: String,
        default: 'The Abel Experience™: Default Edition™',
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'deleted'],
            message: '{VALUE} is not a valid status. Valid values are: draft, published, deleted.'
        },
        default: 'draft'
    },
    publication_date: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

GreentextPostSchema.pre('save', function (next) {
    if (this.isModified('volume_number') || this.isModified('title') || this.full_title_generated) {
        this.full_title_generated = `The Abel Experience™: Volume ${this.volume_number} - ${this.title}`;
    }
    this.updated_at = Date.now();
    next();
    });

module.exports = mongoose.model('GreentextPost', GreentextPostSchema);