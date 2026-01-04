const videosService = require('../services/videosService');
const VideoRepo = require('../models/VideoRepo');

jest.mock('../models/VideoRepo');

test('addComment calls repo with correct args', async () => {
  VideoRepo.addComment.mockResolvedValue({ id: 1, text: 'ok' });
  const c = await videosService.addComment(5, 2, { timestamp: 12, text: 'ok' });
  expect(VideoRepo.addComment).toHaveBeenCalledWith(5, expect.objectContaining({ userId: 2, text: 'ok' }));
  expect(c).toHaveProperty('id', 1);
});